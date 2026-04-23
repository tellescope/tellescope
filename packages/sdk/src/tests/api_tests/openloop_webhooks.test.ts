require('source-map-support').install();

import { Session } from "../../sdk"
import {
  assert,
  async_test,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const
const businessId = '60398b1131a295e64f084ff6'

const v1Url = `${host}/v1/webhooks/openloop/${businessId}`
const v2Url = `${host}/v1/webhooks/openloop-v2/${businessId}`

const postJSON = async (url: string, body: object) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  let data: any
  try { data = await res.json() } catch { data = null }
  return { status: res.status, data }
}

const postV1 = (body: object) => postJSON(v1Url, body)
const postV2 = (body: object) => postJSON(v2Url, body)

let counter = 0
const uid = () => `${Date.now()}-${++counter}`

const makeV1Confirmation = (overrides: Record<string, any> = {}) => ({
  type: 'order_confirmation' as const,
  patientID: 'test-healthie-ol-1',
  pharmacy: 'Test Pharmacy',
  medication_instructions: 'Take once daily',
  shipping_address: '123 Test St',
  orderNumber: `ol-conf-${uid()}`,
  weeksOrdered: 'w4',
  fill: '1',
  medicationSKU: 'SKU-100',
  sku_med: 'Test Medication 10mg',
  ...overrides,
})

const makeV1Shipped = (overrides: Record<string, any> = {}) => ({
  type: 'order_shipped' as const,
  patientID: 'test-healthie-ol-1',
  pharmacy: 'Test Pharmacy',
  shipped_date: '2024-07-09',
  track_number: 'TRACK123',
  status: 'shipped' as const,
  order_date: '2024-07-09',
  orderNumber: `ol-ship-${uid()}`,
  fill: '1',
  medicationSKU: 'SKU-200',
  sku_med: 'Shipped Med 20mg',
  ...overrides,
})

const makeV2Payload = (eventType: string, overrides: Record<string, any> = {}) => ({
  id: `v2-${uid()}`,
  client: 'test-client',
  eventId: `evt-${uid()}`,
  eventType,
  chartId: 'chart-1',
  patientId: 'test-healthie-ol-1',
  providerId: 'provider-1',
  medication: 'V2 Test Med',
  medicationSku: 'v2-sku-001',
  fill: '1',
  prescriptionCreatedDate: '2024-01-15',
  ...overrides,
})

export const openloop_webhooks_tests = async ({ sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("OpenLoop Webhooks Tests")

  const healthieId1 = 'test-healthie-ol-1'
  const healthieId2 = 'test-healthie-ol-2'

  const enduser1 = await sdk.api.endusers.createOne({ source: 'Healthie', externalId: healthieId1 })
  const enduser2 = await sdk.api.endusers.createOne({ source: 'Healthie', externalId: healthieId2 })

  try {
    // ===== SECTION A: V1 Validation =====
    log_header("V1 Validation")

    await async_test(
      'V1: missing patientID returns 400',
      async () => {
        const res = await postV1({ type: 'order_confirmation', pharmacy: 'x', orderNumber: 'x' })
        return res.status
      },
      { onResult: (s: number) => s === 400 }
    )

    await async_test(
      'V1: unknown patient returns 404',
      async () => {
        const res = await postV1(makeV1Confirmation({ patientID: 'nonexistent-patient-id' }))
        return res.status
      },
      { onResult: (s: number) => s === 404 }
    )

    // ===== SECTION B: V1 order_confirmation =====
    log_header("V1 order_confirmation")

    const confOrderNumber = `ol-conf-fields-${uid()}`
    await async_test(
      'V1: order_confirmation creates EnduserOrder with correct fields',
      async () => {
        const res = await postV1(makeV1Confirmation({
          patientID: healthieId1,
          orderNumber: confOrderNumber,
          sku_med: 'Test Med 10mg',
          pharmacy: 'PharmaCo',
          medication_instructions: 'Take daily with food',
          shipping_address: '456 Oak Ave',
          weeksOrdered: 'w12',
          fill: '2',
          medicationSKU: 'SKU-ABC',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: confOrderNumber }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        const order = orders[0]
        assert(order.enduserId === enduser1.id, 'enduserId mismatch')
        assert(order.title === 'Test Med 10mg', `title mismatch: ${order.title}`)
        assert(order.status === 'confirmed', `status mismatch: ${order.status}`)
        assert(order.description === '456 Oak Ave', `description mismatch: ${order.description}`)
        assert(order.instructions === 'Take daily with food', `instructions mismatch: ${order.instructions}`)
        assert(order.frequency === 'w12', `frequency mismatch: ${order.frequency}`)
        assert(order.fill === '2', `fill mismatch: ${order.fill}`)
        assert(order.sku === 'sku-abc', `sku mismatch (should be lowercased): ${order.sku}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    await async_test(
      'V1: order_confirmation maps program_code to protocol field',
      async () => {
        const orderNum = `ol-conf-protocol-${uid()}`
        const res = await postV1(makeV1Confirmation({
          patientID: healthieId1,
          orderNumber: orderNum,
          program_code: 'Weight-Loss',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: orderNum }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        assert(orders[0].protocol === 'Weight-Loss', `protocol mismatch: ${orders[0].protocol}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    await async_test(
      'V1: order_confirmation idempotency - same order not duplicated',
      async () => {
        // Post same orderNumber again
        const res = await postV1(makeV1Confirmation({
          patientID: healthieId1,
          orderNumber: confOrderNumber,
          sku_med: 'Different Title',
          fill: '99',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: confOrderNumber }
        })
        assert(orders.length === 1, `Expected 1 order after duplicate, got ${orders.length}`)
        // $setOnInsert means fields should NOT have changed
        assert(orders[0].title === 'Test Med 10mg', `title should not change on duplicate: ${orders[0].title}`)
        assert(orders[0].fill === '2', `fill should not change on duplicate: ${orders[0].fill}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    await async_test(
      'V1: order_confirmation without sku_med falls back to pharmacy name',
      async () => {
        const orderNum = `ol-conf-fallback-${uid()}`
        const res = await postV1(makeV1Confirmation({
          patientID: healthieId1,
          orderNumber: orderNum,
          sku_med: undefined,
          pharmacy: 'FallbackPharmacy',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: orderNum }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        assert(orders[0].title === 'OpenLoop: FallbackPharmacy', `title mismatch: ${orders[0].title}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    // ===== SECTION C: V1 order_shipped =====
    log_header("V1 order_shipped")

    const shipOrderNumber = `ol-ship-update-${uid()}`
    await async_test(
      'V1: order_shipped updates existing confirmed order',
      async () => {
        // First create a confirmed order
        await postV1(makeV1Confirmation({
          patientID: healthieId1,
          orderNumber: shipOrderNumber,
        }))

        // Now ship it
        const res = await postV1(makeV1Shipped({
          patientID: healthieId1,
          orderNumber: shipOrderNumber,
          track_number: 'TRACK-ABC',
          shipped_date: '2024-07-09',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: shipOrderNumber }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        const order = orders[0]
        assert(order.status === 'shipped', `status mismatch: ${order.status}`)
        assert(order.tracking === 'TRACK-ABC', `tracking mismatch: ${order.tracking}`)
        assert(order.shippedDate === '07-09-2024', `shippedDate mismatch (expected MM-DD-YYYY): ${order.shippedDate}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    await async_test(
      'V1: order_shipped updates title and sku when provided',
      async () => {
        // Ship again with sku_med and medicationSKU
        const res = await postV1(makeV1Shipped({
          patientID: healthieId1,
          orderNumber: shipOrderNumber,
          sku_med: 'Updated Title From Ship',
          medicationSKU: 'NEW-SKU-123',
          track_number: 'TRACK-DEF',
          shipped_date: '2024-08-15',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: shipOrderNumber }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        const order = orders[0]
        assert(order.title === 'Updated Title From Ship', `title mismatch: ${order.title}`)
        assert(order.sku === 'new-sku-123', `sku mismatch (should be lowercased): ${order.sku}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    await async_test(
      'V1: order_shipped creates new order if none exists',
      async () => {
        const newOrderNum = `ol-ship-new-${uid()}`
        const res = await postV1(makeV1Shipped({
          patientID: healthieId1,
          orderNumber: newOrderNum,
          sku_med: 'Direct Ship Med',
          track_number: 'TRACK-NEW',
          shipped_date: '2024-09-01',
          fill: '3',
          medicationSKU: 'DIRECT-SKU',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: newOrderNum }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        const order = orders[0]
        assert(order.status === 'shipped', `status mismatch: ${order.status}`)
        assert(order.title === 'Direct Ship Med', `title mismatch: ${order.title}`)
        assert(order.tracking === 'TRACK-NEW', `tracking mismatch: ${order.tracking}`)
        assert(order.fill === '3', `fill mismatch: ${order.fill}`)
        assert(order.sku === 'direct-sku', `sku mismatch: ${order.sku}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    await async_test(
      'V1: order_shipped can re-ship with updated tracking',
      async () => {
        const reshipOrderNum = `ol-reship-${uid()}`
        // Create and ship
        await postV1(makeV1Confirmation({ patientID: healthieId1, orderNumber: reshipOrderNum }))
        await postV1(makeV1Shipped({
          patientID: healthieId1,
          orderNumber: reshipOrderNum,
          track_number: 'TRACK-FIRST',
          shipped_date: '2024-07-01',
        }))

        // Re-ship with new tracking
        const res = await postV1(makeV1Shipped({
          patientID: healthieId1,
          orderNumber: reshipOrderNum,
          track_number: 'TRACK-SECOND',
          shipped_date: '2024-07-15',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: reshipOrderNum }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        assert(orders[0].tracking === 'TRACK-SECOND', `tracking should be updated: ${orders[0].tracking}`)
        assert(orders[0].shippedDate === '07-15-2024', `shippedDate should be updated: ${orders[0].shippedDate}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    await async_test(
      'V1: order_shipped maps program_code to protocol field',
      async () => {
        const orderNum = `ol-ship-protocol-${uid()}`
        await postV1(makeV1Confirmation({ patientID: healthieId1, orderNumber: orderNum }))
        const res = await postV1(makeV1Shipped({
          patientID: healthieId1,
          orderNumber: orderNum,
          program_code: 'Diabetes',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: orderNum }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        assert(orders[0].protocol === 'Diabetes', `protocol mismatch: ${orders[0].protocol}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    // ===== SECTION D: V1 enduserId Isolation =====
    log_header("V1 enduserId Isolation")

    await async_test(
      'V1: same orderNumber for different endusers creates separate orders',
      async () => {
        const sharedOrderNum = `ol-shared-${uid()}`

        const res1 = await postV1(makeV1Confirmation({
          patientID: healthieId1,
          orderNumber: sharedOrderNum,
        }))
        assert(res1.status === 200, `enduser1 confirm failed: ${res1.status}`)

        const res2 = await postV1(makeV1Confirmation({
          patientID: healthieId2,
          orderNumber: sharedOrderNum,
        }))
        assert(res2.status === 200, `enduser2 confirm failed: ${res2.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: sharedOrderNum }
        })
        assert(orders.length === 2, `Expected 2 separate orders, got ${orders.length}`)

        const enduserIds = orders.map(o => o.enduserId).sort()
        const expected = [enduser1.id, enduser2.id].sort()
        assert(
          enduserIds[0] === expected[0] && enduserIds[1] === expected[1],
          `Orders should belong to different endusers: ${JSON.stringify(enduserIds)} vs ${JSON.stringify(expected)}`
        )
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    // ===== SECTION E: V2 Validation =====
    log_header("V2 Validation")

    await async_test(
      'V2: missing patientId returns 400',
      async () => {
        const res = await postV2({
          id: 'test', eventType: 'prescription-created', medication: 'x',
          medicationSku: 'x', fill: '1', prescriptionCreatedDate: '2024-01-01',
        })
        return res.status
      },
      { onResult: (s: number) => s === 400 }
    )

    await async_test(
      'V2: invalid eventType returns 400',
      async () => {
        const res = await postV2(makeV2Payload('invalid-event-type'))
        return res.status
      },
      { onResult: (s: number) => s === 400 }
    )

    await async_test(
      'V2: unknown patient returns 404',
      async () => {
        const res = await postV2(makeV2Payload('prescription-created', { patientId: 'nonexistent-v2' }))
        return res.status
      },
      { onResult: (s: number) => s === 404 }
    )

    // ===== SECTION F: V2 Order Lifecycle =====
    log_header("V2 Order Lifecycle")

    const v2OrderId = `v2-lifecycle-${uid()}`
    await async_test(
      'V2: prescription-created creates order with correct fields',
      async () => {
        const res = await postV2(makeV2Payload('prescription-created', {
          id: v2OrderId,
          patientId: healthieId1,
          medication: 'Lisinopril 10mg',
          medicationSku: 'LIS-010',
          fill: '2',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: v2OrderId }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        const order = orders[0]
        assert(order.enduserId === enduser1.id, 'enduserId mismatch')
        assert(order.status === 'created', `status mismatch: ${order.status}`)
        assert(order.title === 'Lisinopril 10mg', `title mismatch: ${order.title}`)
        assert(order.fill === '2', `fill mismatch: ${order.fill}`)
        assert(order.sku === 'lis-010', `sku mismatch (should be lowercased): ${order.sku}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    await async_test(
      'V2: prescription-created maps program_code to protocol field',
      async () => {
        const orderNum = `v2-protocol-${uid()}`
        const res = await postV2(makeV2Payload('prescription-created', {
          id: orderNum,
          patientId: healthieId1,
          program_code: 'GLP-1',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: orderNum }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        assert(orders[0].protocol === 'GLP-1', `protocol mismatch: ${orders[0].protocol}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    await async_test(
      'V2: prescription-shipped updates with carrier and tracking',
      async () => {
        const res = await postV2(makeV2Payload('prescription-shipped', {
          id: v2OrderId,
          patientId: healthieId1,
          carrier: 'USPS',
          carrierTrackingId: 'V2-TRACK-001',
          prescriptionCarrierDate: '2024-02-20',
          pharmacy: 'CVS',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: v2OrderId }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        const order = orders[0]
        assert(order.status === 'shipped', `status mismatch: ${order.status}`)
        assert(order.carrier === 'USPS', `carrier mismatch: ${order.carrier}`)
        assert(order.tracking === 'V2-TRACK-001', `tracking mismatch: ${order.tracking}`)
        assert(order.shippedDate === '2024-02-20', `shippedDate mismatch: ${order.shippedDate}`)
        assert(order.pharmacy === 'CVS', `pharmacy mismatch: ${order.pharmacy}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    const v2CancelId = `v2-cancel-${uid()}`
    await async_test(
      'V2: prescription-cancelled sets cancelledDate and reason',
      async () => {
        // Create first
        await postV2(makeV2Payload('prescription-created', {
          id: v2CancelId,
          patientId: healthieId1,
        }))

        // Cancel
        const res = await postV2(makeV2Payload('prescription-cancelled', {
          id: v2CancelId,
          patientId: healthieId1,
          prescriptionCancelledDate: '2024-03-01',
          prescriptionCancellationReason: 'Patient request',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: v2CancelId }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        const order = orders[0]
        assert(order.status === 'cancelled', `status mismatch: ${order.status}`)
        assert(order.cancelledDate === '2024-03-01', `cancelledDate mismatch: ${order.cancelledDate}`)
        assert(order.cancellationReason === 'Patient request', `cancellationReason mismatch: ${order.cancellationReason}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    const v2RefundId = `v2-refund-${uid()}`
    await async_test(
      'V2: prescription-refunded sets status',
      async () => {
        await postV2(makeV2Payload('prescription-created', {
          id: v2RefundId,
          patientId: healthieId1,
        }))

        const res = await postV2(makeV2Payload('prescription-refunded', {
          id: v2RefundId,
          patientId: healthieId1,
          prescriptionRefundedDate: '2024-04-01',
        }))
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: v2RefundId }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        assert(orders[0].status === 'refunded', `status mismatch: ${orders[0].status}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    // ===== SECTION G: V2 Idempotency & Isolation =====
    log_header("V2 Idempotency & Isolation")

    await async_test(
      'V2: idempotency - same id and patientId does not create duplicate',
      async () => {
        const idempotentId = `v2-idemp-${uid()}`
        await postV2(makeV2Payload('prescription-created', {
          id: idempotentId,
          patientId: healthieId1,
        }))
        await postV2(makeV2Payload('prescription-created', {
          id: idempotentId,
          patientId: healthieId1,
        }))

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: idempotentId }
        })
        assert(orders.length === 1, `Expected 1 order after duplicate, got ${orders.length}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    await async_test(
      'V2: same id for different patients creates separate orders',
      async () => {
        const sharedV2Id = `v2-shared-${uid()}`
        const res1 = await postV2(makeV2Payload('prescription-created', {
          id: sharedV2Id,
          patientId: healthieId1,
        }))
        assert(res1.status === 200, `enduser1 create failed: ${res1.status}`)

        const res2 = await postV2(makeV2Payload('prescription-created', {
          id: sharedV2Id,
          patientId: healthieId2,
        }))
        assert(res2.status === 200, `enduser2 create failed: ${res2.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: sharedV2Id }
        })
        assert(orders.length === 2, `Expected 2 separate orders, got ${orders.length}`)

        const enduserIds = orders.map(o => o.enduserId).sort()
        const expected = [enduser1.id, enduser2.id].sort()
        assert(
          enduserIds[0] === expected[0] && enduserIds[1] === expected[1],
          `Orders should belong to different endusers`
        )
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    // ===== SECTION H: V2 Full Lifecycle =====
    log_header("V2 Full Lifecycle")

    await async_test(
      'V2: sequential status progression through full lifecycle',
      async () => {
        const lifecycleId = `v2-full-${uid()}`
        const base = { id: lifecycleId, patientId: healthieId1 }

        const steps: { eventType: string, expectedStatus: string, extras?: Record<string, any> }[] = [
          { eventType: 'prescription-created', expectedStatus: 'created' },
          { eventType: 'prescription-invoiced', expectedStatus: 'invoiced' },
          { eventType: 'prescription-paid', expectedStatus: 'paid' },
          { eventType: 'prescription-ordered', expectedStatus: 'ordered' },
          { eventType: 'prescription-shipped', expectedStatus: 'shipped', extras: { carrier: 'FedEx', carrierTrackingId: 'FX-999' } },
        ]

        for (const step of steps) {
          const res = await postV2(makeV2Payload(step.eventType, { ...base, ...(step.extras || {}) }))
          assert(res.status === 200, `${step.eventType} failed: ${res.status}`)

          const orders = await sdk.api.enduser_orders.getSome({
            filter: { source: 'OpenLoop', externalId: lifecycleId }
          })
          assert(orders.length === 1, `Expected 1 order at ${step.eventType}, got ${orders.length}`)
          assert(
            orders[0].status === step.expectedStatus,
            `After ${step.eventType}: expected status '${step.expectedStatus}', got '${orders[0].status}'`
          )
        }
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    // ===== SECTION I: V2 Undefined Field Handling =====
    log_header("V2 Undefined Field Handling")

    await async_test(
      'V2: optional fields not written when absent',
      async () => {
        const minimalId = `v2-minimal-${uid()}`
        const res = await postV2({
          id: minimalId,
          client: 'test',
          eventId: `evt-${uid()}`,
          eventType: 'prescription-created',
          chartId: 'chart-1',
          patientId: healthieId1,
          providerId: 'prov-1',
          medication: 'Minimal Med',
          medicationSku: 'min-sku',
          fill: '1',
          prescriptionCreatedDate: '2024-01-01',
          // Intentionally omitting: pharmacy, carrier, carrierTrackingId,
          // prescriptionCancelledDate, prescriptionCancellationReason, etc.
        })
        assert(res.status === 200, `Expected 200, got ${res.status}`)

        const orders = await sdk.api.enduser_orders.getSome({
          filter: { source: 'OpenLoop', externalId: minimalId }
        })
        assert(orders.length === 1, `Expected 1 order, got ${orders.length}`)
        const order = orders[0]
        assert(order.carrier === undefined, `carrier should be undefined, got: ${order.carrier}`)
        assert(order.tracking === undefined, `tracking should be undefined, got: ${order.tracking}`)
        assert(order.pharmacy === undefined, `pharmacy should be undefined, got: ${order.pharmacy}`)
        assert(order.cancelledDate === undefined, `cancelledDate should be undefined, got: ${order.cancelledDate}`)
        assert(order.cancellationReason === undefined, `cancellationReason should be undefined, got: ${order.cancellationReason}`)
        return true
      },
      { onResult: (r: boolean) => r === true }
    )

    console.log("All OpenLoop webhook tests passed!")

  } finally {
    await sdk.api.endusers.deleteOne(enduser1.id).catch(console.error)
    await sdk.api.endusers.deleteOne(enduser2.id).catch(console.error)
  }
}

// Allow running this test file independently
if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await openloop_webhooks_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("OpenLoop webhooks test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("OpenLoop webhooks test suite failed:", error)
      process.exit(1)
    })
}
