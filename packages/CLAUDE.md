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
- **`react/components/`** - Core UI library (React + React Native)
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
- **Cross-platform**: React web, React Native, Node.js support

## Usage Patterns
- **Internal**: Used by Tellescope applications (webapp, portal, api, worker)
- **External**: Available for third-party healthcare integrations
- **Embedding**: Components for external healthcare applications
- **SDK Integration**: Full API access for healthcare developers

## Publishing
- Published to public npm registry
- Semantic versioning with coordinated releases