# Tellescope SDK

## Purpose
Official TypeScript SDK for integrating with the Tellescope healthcare platform API with type-safe access to all platform features.

## Key Features
- Type-safe API with auto-completion
- Built-in session management and authentication
- Complete CRUD operations for all healthcare data models
- Real-time WebSocket support
- HIPAA-compliant file management

## Entry Points
- **Main**: `src/sdk.ts` - Main SDK class with session management
- **Public**: `src/public.ts` - Unauthenticated endpoints
- **Patient**: `src/enduser.ts` - Patient-specific operations
- **Session**: `src/session.ts` - Authentication and session management

## Critical Safety Notes
- 🔒 All methods automatically enforce organization-scoped queries for multi-tenancy
- 🔒 Built-in audit logging for PHI access
- ✅ Safe to add new utility methods and type definitions

## Dependencies
- @tellescope/schema, @tellescope/types-*
- axios for HTTP client