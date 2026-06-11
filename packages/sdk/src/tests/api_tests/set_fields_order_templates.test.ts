require('source-map-support').install();

import { Session } from "../../sdk"
import {
  assert,
  async_test,
  log_header,
  wait,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

const TRIGGER_TITLE_BLOCK_A = "Order Templates: Block A"
const TRIGGER_TITLE_BLOCK_B = "Order Templates: Block B"

const buildSetFieldsAction = (prefix: string) => ({
  type: 'Set Fields' as const,
  info: {
    fields: [
      { name: `${prefix}_status`,     value: '{{order.status}}',     type: 'Custom Value' as const },
      { name: `${prefix}_tracking`,   value: '{{order.tracking}}',   type: 'Custom Value' as const },
      { name: `${prefix}_carrier`,    value: '{{order.carrier}}',    type: 'Custom Value' as const },
      { name: `${prefix}_sku`,        value: '{{order.sku}}',        type: 'Custom Value' as const },
      { name: `${prefix}_externalId`, value: '{{order.externalId}}', type: 'Custom Value' as const },
      { name: `${prefix}_id`,         value: '{{order.id}}',         type: 'Custom Value' as const },
      { name: `${prefix}_protocol`,   value: '{{order.protocol}}',   type: 'Custom Value' as const },
    ],
  },
})

// Block A: Direct EnduserOrder creation path
const direct_order_creation_block = async ({ sdk }: { sdk: Session }) => {
  log_header("Block A: Direct EnduserOrder creation -> {{order.*}} in Set Fields")

  const enduser = await sdk.api.endusers.createOne({})
  const trigger = await sdk.api.automation_triggers.createOne({
    title: TRIGGER_TITLE_BLOCK_A,
    status: 'Active',
    event: { type: 'Order Status Equals', info: { source: 'Beluga', status: 'Shipped' } },
    action: buildSetFieldsAction('pharmacy'),
  })

  let createdOrderId: string | undefined
  let nonMatchingOrderId: string | undefined

  try {
    const order = await sdk.api.enduser_orders.createOne({
      enduserId: enduser.id,
      source: 'Beluga',
      status: 'Shipped',
      title: 'Beluga Pharmacy Order',
      externalId: 'EXT-A-123',
      tracking: '1Z-AAA',
      carrier: 'UPS',
      sku: 'SKU-A',
      protocol: 'wl1',
    })
    createdOrderId = order.id

    await wait(undefined, 250) // allow trigger + Set Fields to run

    await async_test(
      "Block A: {{order.*}} templates resolve to literal values",
      () => sdk.api.endusers.getOne(enduser.id),
      { onResult: e => !!(
           e.fields?.pharmacy_status === 'Shipped'
        && e.fields?.pharmacy_tracking === '1Z-AAA'
        && e.fields?.pharmacy_carrier === 'UPS'
        && e.fields?.pharmacy_sku === 'SKU-A'
        && e.fields?.pharmacy_externalId === 'EXT-A-123'
        && e.fields?.pharmacy_protocol === 'wl1'
        && typeof e.fields?.pharmacy_id === 'string'
        && (e.fields?.pharmacy_id as string).length > 0
        && (e.fields?.pharmacy_id as string) === order.id
      )}
    )

    // Negative case: status that doesn't match the trigger should NOT alter fields
    const beforeNonMatch = await sdk.api.endusers.getOne(enduser.id)
    const snapshot = {
      pharmacy_status: beforeNonMatch.fields?.pharmacy_status,
      pharmacy_tracking: beforeNonMatch.fields?.pharmacy_tracking,
      pharmacy_carrier: beforeNonMatch.fields?.pharmacy_carrier,
      pharmacy_sku: beforeNonMatch.fields?.pharmacy_sku,
      pharmacy_externalId: beforeNonMatch.fields?.pharmacy_externalId,
      pharmacy_id: beforeNonMatch.fields?.pharmacy_id,
      pharmacy_protocol: beforeNonMatch.fields?.pharmacy_protocol,
    }

    const nonMatching = await sdk.api.enduser_orders.createOne({
      enduserId: enduser.id,
      source: 'Beluga',
      status: 'In Fulfillment', // does NOT match the trigger
      title: 'Beluga Pharmacy Order (other status)',
      externalId: 'EXT-A-NOMATCH',
      tracking: 'NOPE',
      carrier: 'NoCarrier',
      sku: 'SKU-NOPE',
      protocol: 'nope',
    })
    nonMatchingOrderId = nonMatching.id

    await wait(undefined, 250)

    await async_test(
      "Block A: non-matching status leaves fields unchanged",
      () => sdk.api.endusers.getOne(enduser.id),
      { onResult: e => !!(
           e.fields?.pharmacy_status === snapshot.pharmacy_status
        && e.fields?.pharmacy_tracking === snapshot.pharmacy_tracking
        && e.fields?.pharmacy_carrier === snapshot.pharmacy_carrier
        && e.fields?.pharmacy_sku === snapshot.pharmacy_sku
        && e.fields?.pharmacy_externalId === snapshot.pharmacy_externalId
        && e.fields?.pharmacy_id === snapshot.pharmacy_id
        && e.fields?.pharmacy_protocol === snapshot.pharmacy_protocol
      )}
    )
  } finally {
    if (createdOrderId) await sdk.api.enduser_orders.deleteOne(createdOrderId).catch(console.error)
    if (nonMatchingOrderId) await sdk.api.enduser_orders.deleteOne(nonMatchingOrderId).catch(console.error)
    await sdk.api.automation_triggers.deleteOne(trigger.id).catch(console.error)
    await sdk.api.endusers.deleteOne(enduser.id).catch(console.error)
  }
}

// Block B: Beluga webhook integration path
const beluga_webhook_block = async ({ sdk }: { sdk: Session }) => {
  log_header("Block B: Beluga webhook -> {{order.*}} in Set Fields")

  const webhookUrl = `${host}/v1/webhooks/beluga`
  const externalOrderId = `EXT-B-${Date.now()}`

  const enduser = await sdk.api.endusers.createOne({})
  const form = await sdk.api.forms.createOne({ title: 'Order Templates Beluga Form' })
  const formResponse = await sdk.api.form_responses.createOne({
    formId: form.id,
    enduserId: enduser.id,
    formTitle: form.title,
  })

  const trigger = await sdk.api.automation_triggers.createOne({
    title: TRIGGER_TITLE_BLOCK_B,
    status: 'Active',
    event: { type: 'Order Status Equals', info: { source: 'Beluga', status: 'Shipped' } },
    action: buildSetFieldsAction('pharmacy'),
  })

  const deliveredTrigger = await sdk.api.automation_triggers.createOne({
    title: `${TRIGGER_TITLE_BLOCK_B} (Delivered)`,
    status: 'Active',
    event: { type: 'Order Status Equals', info: { source: 'Beluga', status: 'Delivered' } },
    action: buildSetFieldsAction('pharmacy'),
  })

  try {
    // Step 1: PHARMACY_ORDER_SHIPPED
    const shippedRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        masterId: `tellescope_${formResponse.id}`,
        event: 'PHARMACY_ORDER_SHIPPED',
        orderId: externalOrderId,
        info: { carrier: 'FedEx', tracking: '7777-BBB' },
      }),
    })
    assert(shippedRes.status === 200, `Beluga webhook (shipped) expected 200, got ${shippedRes.status}`)

    await wait(undefined, 250) // webhook upsert + trigger + Set Fields

    await async_test(
      "Block B: Beluga PHARMACY_ORDER_SHIPPED resolves {{order.*}} into enduser fields",
      () => sdk.api.endusers.getOne(enduser.id),
      { onResult: e => !!(
           e.fields?.pharmacy_status === 'Shipped'
        && e.fields?.pharmacy_tracking === '7777-BBB'
        && e.fields?.pharmacy_carrier === 'FedEx'
        && e.fields?.pharmacy_externalId === externalOrderId
        && typeof e.fields?.pharmacy_id === 'string'
        && (e.fields?.pharmacy_id as string).length > 0
        // Webhook does not set sku/protocol -> default branch in helper -> ''
        && e.fields?.pharmacy_sku === ''
        && e.fields?.pharmacy_protocol === ''
      )}
    )

    // Step 2: PHARMACY_ORDER_DELIVERED for the same order
    const deliveredRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        masterId: `tellescope_${formResponse.id}`,
        event: 'PHARMACY_ORDER_DELIVERED',
        orderId: externalOrderId,
      }),
    })
    assert(deliveredRes.status === 200, `Beluga webhook (delivered) expected 200, got ${deliveredRes.status}`)

    await wait(undefined, 250)

    await async_test(
      "Block B: PHARMACY_ORDER_DELIVERED flips pharmacy_status to 'Delivered'",
      () => sdk.api.endusers.getOne(enduser.id),
      { onResult: e => !!(
           e.fields?.pharmacy_status === 'Delivered'
        && e.fields?.pharmacy_externalId === externalOrderId
      )}
    )
  } finally {
    // Clean up the order created by the webhook
    try {
      const orders = await sdk.api.enduser_orders.getSome({
        filter: { source: 'Beluga', externalId: externalOrderId } as any,
      })
      for (const o of orders) {
        await sdk.api.enduser_orders.deleteOne(o.id).catch(console.error)
      }
    } catch (err) {
      console.error(err)
    }

    await sdk.api.automation_triggers.deleteOne(trigger.id).catch(console.error)
    await sdk.api.automation_triggers.deleteOne(deliveredTrigger.id).catch(console.error)
    await sdk.api.form_responses.deleteOne(formResponse.id).catch(console.error)
    await sdk.api.forms.deleteOne(form.id).catch(console.error)
    await sdk.api.endusers.deleteOne(enduser.id).catch(console.error)
  }
}

// Block C: Beluga tracking status update events (PACKAGE_*)
const beluga_tracking_status_block = async ({ sdk }: { sdk: Session }) => {
  log_header("Block C: Beluga tracking status updates (PACKAGE_* events)")

  const webhookUrl = `${host}/v1/webhooks/beluga`
  const externalOrderId = `EXT-C-${Date.now()}`
  const trackingUrl = 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400-CCC'

  const enduser = await sdk.api.endusers.createOne({})
  const form = await sdk.api.forms.createOne({ title: 'Tracking Status Beluga Form' })
  const formResponse = await sdk.api.form_responses.createOne({
    formId: form.id,
    enduserId: enduser.id,
    formTitle: form.title,
  })

  const inTransitTrigger = await sdk.api.automation_triggers.createOne({
    title: `${TRIGGER_TITLE_BLOCK_B} (In Transit)`,
    status: 'Active',
    event: { type: 'Order Status Equals', info: { source: 'Beluga', status: 'In Transit' } },
    action: buildSetFieldsAction('pharmacy'),
  })

  const postEvent = async (event: string, info?: object) => {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        masterId: `tellescope_${formResponse.id}`,
        event,
        orderId: externalOrderId,
        ...info ? { info } : {},
      }),
    })
    assert(res.status === 200, `Beluga webhook (${event}) expected 200, got ${res.status}`)
    await wait(undefined, 250) // webhook upsert + trigger + Set Fields
  }

  const getOrder = async () => {
    const orders = await sdk.api.enduser_orders.getSome({
      filter: { source: 'Beluga', externalId: externalOrderId } as any,
    })
    return orders[0]
  }

  try {
    // Order ships first, then tracking updates arrive
    await postEvent('PHARMACY_ORDER_SHIPPED', { carrier: 'USPS', tracking: '9400-CCC' })

    await postEvent('PACKAGE_IN_TRANSIT', {
      trackerStatus: 'in_transit',
      trackerId: 'trk_123',
      trackingUrl,
      tracking: '9400-CCC',
      carrier: 'USPS',
    })

    await async_test(
      "Block C: PACKAGE_IN_TRANSIT fires 'In Transit' trigger with trackingUrl preferred over tracking",
      () => sdk.api.endusers.getOne(enduser.id),
      { onResult: e => !!(
           e.fields?.pharmacy_status === 'In Transit'
        && e.fields?.pharmacy_tracking === trackingUrl
        && e.fields?.pharmacy_carrier === 'USPS'
        && e.fields?.pharmacy_externalId === externalOrderId
      )}
    )

    await postEvent('PACKAGE_OUT_FOR_DELIVERY', {
      trackerStatus: 'out_for_delivery',
      trackingUrl,
      carrier: 'USPS',
    })
    await async_test(
      "Block C: PACKAGE_OUT_FOR_DELIVERY sets order status 'Out for Delivery'",
      getOrder,
      { onResult: o => o?.status === 'Out for Delivery' }
    )

    const deliveredDate = new Date().toISOString()
    await postEvent('PACKAGE_DELIVERED', {
      trackerStatus: 'delivered',
      trackingUrl,
      carrier: 'USPS',
      deliveredDate,
    })
    await async_test(
      "Block C: PACKAGE_DELIVERED sets status 'Delivered' and stores deliveredDate",
      getOrder,
      { onResult: o => !!(
           o?.status === 'Delivered'
        && o?.deliveredDate === deliveredDate
      )}
    )

    await postEvent('PACKAGE_DELIVERY_FAILED', { trackerStatus: 'failure' })
    await async_test(
      "Block C: PACKAGE_DELIVERY_FAILED sets order status 'Delivery Failed'",
      getOrder,
      { onResult: o => o?.status === 'Delivery Failed' }
    )
  } finally {
    // Clean up the order created by the webhook
    try {
      const orders = await sdk.api.enduser_orders.getSome({
        filter: { source: 'Beluga', externalId: externalOrderId } as any,
      })
      for (const o of orders) {
        await sdk.api.enduser_orders.deleteOne(o.id).catch(console.error)
      }
    } catch (err) {
      console.error(err)
    }

    await sdk.api.automation_triggers.deleteOne(inTransitTrigger.id).catch(console.error)
    await sdk.api.form_responses.deleteOne(formResponse.id).catch(console.error)
    await sdk.api.forms.deleteOne(form.id).catch(console.error)
    await sdk.api.endusers.deleteOne(enduser.id).catch(console.error)
  }
}

export const set_fields_order_templates_tests = async (
  { sdk, sdkNonAdmin }: { sdk: Session, sdkNonAdmin: Session }
) => {
  log_header("Set Fields: {{order.*}} template resolution")
  await direct_order_creation_block({ sdk })
  await beluga_webhook_block({ sdk })
  await beluga_tracking_status_block({ sdk })
}

if (require.main === module) {
  console.log(`Using API URL: ${host}`)
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await set_fields_order_templates_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("set_fields_order_templates test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("set_fields_order_templates test suite failed:", error)
      process.exit(1)
    })
}
