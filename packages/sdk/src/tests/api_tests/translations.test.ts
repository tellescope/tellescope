require('source-map-support').install();

import { Session } from "../../sdk"
import {
  assert,
  log_header,
} from "@tellescope/testing"
import { setup_tests } from "../setup"

const host = process.env.API_URL || 'http://localhost:8080' as const

// Modular test for the translations framework.
// Validates that a model's `translations` field (nested { field: { language: text } }) is accepted by
// schema validation, persists, and accumulates multiple languages (uses phone_calls as the MVP model).
//
// NOTE: this test deliberately does NOT invoke the AI translation endpoint (ai_conversations.send_message).
// That path consumes AI credits and belongs in an eval, not a regularly-run test. The endpoint itself is
// already covered by the AI Summary feature, and the translation-specific logic (the system-prompt
// builder in @tellescope/utilities) is a pure function verified at compile time.
export const translations_tests = async ({ sdk } : { sdk: Session, sdkNonAdmin: Session }) => {
  log_header("Translations Framework Tests")

  const enduser = await sdk.api.endusers.createOne({ fname: 'Translation', lname: 'Tester' })
  let callId: string | undefined

  try {
    const call = await sdk.api.phone_calls.createOne({
      enduserId: enduser.id,
      inbound: true,
      userId: sdk.userInfo.id,
      transcription: 'Hola, por favor devuélvame la llamada cuando pueda.',
    })
    callId = call.id

    // --- 1. translations field accepted + persisted ---
    const translations = { transcription: { en: 'Hi, please call me back when you can.' } }
    await sdk.api.phone_calls.updateOne(call.id, { translations }, { replaceObjectFields: true })

    const updated = await sdk.api.phone_calls.getOne(call.id)
    assert(
      updated.translations?.transcription?.en === translations.transcription.en,
      `translations not persisted: ${JSON.stringify(updated.translations)}`,
      'translations field persisted correctly',
    )

    // add a second language and confirm accumulation (full merged object written by convention)
    const merged = {
      ...updated.translations,
      transcription: { ...updated.translations?.transcription, es: 'Hola de nuevo.' },
    }
    await sdk.api.phone_calls.updateOne(call.id, { translations: merged }, { replaceObjectFields: true })
    const updated2 = await sdk.api.phone_calls.getOne(call.id)
    assert(
      !!updated2.translations?.transcription?.en && !!updated2.translations?.transcription?.es,
      `translations did not accumulate: ${JSON.stringify(updated2.translations)}`,
      'multiple language translations accumulate under one field',
    )
  } finally {
    if (callId) await sdk.api.phone_calls.deleteOne(callId).catch(() => {})
    await sdk.api.endusers.deleteOne(enduser.id).catch(() => {})
  }
}

// Allow running this test file independently
if (require.main === module) {
  const sdk = new Session({ host })
  const sdkNonAdmin = new Session({ host })

  const runTests = async () => {
    await setup_tests(sdk, sdkNonAdmin)
    await translations_tests({ sdk, sdkNonAdmin })
  }

  runTests()
    .then(() => {
      console.log("✅ Translations test suite completed successfully")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ Translations test suite failed:", error)
      process.exit(1)
    })
}
