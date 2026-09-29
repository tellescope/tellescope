# Tellescope Public Packages

## Overview
Public npm packages providing shared functionality across Tellescope applications and for external developer integrations. All packages are TypeScript-first with dual CommonJS and ESM builds.

## Package Categories

### SDK & Integration
- **`sdk/`** - Official TypeScript SDK for API integration
- **`schema/`** - Data schema definitions and validation

### Type Definitions
- **`types-client/`** - Client-side TypeScript definitions
- **`types-models/`** - Database model types and healthcare data structures
- **`types-server/`** - Server-side TypeScript definitions
- **`types-utilities/`** - Utility type definitions and helpers

### React Components
- **`react/components/`** - Core UI library (React web; the React Native entry was removed 2026-09-11)
- **`react/chat/`** - Chat functionality components
- **`react/video-chat/`** - Video calling with AWS Chime

### Utilities & Infrastructure
- **`utilities/`** - Shared functions including cross-platform ObjectId
- **`validation/`** - Healthcare-specific validation functions
- **`constants/`** - Shared constants across applications
- **`testing/`** - Testing utilities and mock data generators

## Build System
- **TypeScript Project References**: Dependency-aware incremental compilation
- **Dual Build**: CommonJS (`lib/cjs/`) and ESM (`lib/esm/`) outputs  
- **Lerna Management**: Synchronized versioning across all packages
- **Targets**: React web (components, chat, video-chat) and Node.js (sdk, utilities, validation, schema, types). React Native support was dropped 2026-09-11: it had no app in this repo and its dependency chain forced `--legacy-peer-deps` on every install

## Usage Patterns
- **Internal**: Used by Tellescope applications (webapp, portal, api, worker)
- **External**: Available for third-party healthcare integrations
- **Embedding**: Components for external healthcare applications
- **SDK Integration**: Full API access for healthcare developers

## Publishing
- Published to public npm registry
- Semantic versioning with coordinated releases (lerna fixed mode: one version across all packages, internal pins exact)
- The next release is the **2.0 beta line** — `2.0.0-beta.N` under the `beta` dist-tag, with `latest` left on 1.256.16. Runbook, breaking-change list and the post-publish audit check: `docs/releases/v2.md`. Arguments to `publish.sh` are forwarded to `lerna publish`; never hand-edit versions.
- `utilities`, `validation`, `schema`, `sdk`, `react-components`, `chat` and `video-chat` declare `engines.node >= 22.12.0` (inherited from `sanitize-html@2.17.7`). Adding a dependency with a higher floor means updating those fields.