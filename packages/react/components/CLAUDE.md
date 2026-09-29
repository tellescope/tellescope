# Tellescope React Components

## Purpose
Shared UI component library for the React web applications (webapp, portal) with healthcare-optimized components, consistent design, accessibility, and HIPAA-compliant functionality. The React Native entry (`*.native.tsx`, `index.native.ts`, the `react-native` peer and the `react-native-*` dependencies) was removed on 2026-09-11: no React Native app existed in this repo and that dependency chain was the reason every install needed `--legacy-peer-deps`.

## Key Features
- Healthcare-optimized form system with dynamic builders
- HIPAA-compliant authentication and security components
- Accessibility-focused design (WCAG 2.1 AA compliant)
- Real-time capabilities and theming system

## Entry Points
- **Web**: `index.ts` - Material-UI integrated components
- **Shared Logic**: `hooks.ts`, `state.tsx` - business logic shared across the web apps
- **Specialized**: `Forms/`, `Community/`, `CMS/`, `Calendar/` modules

## Component Categories
- **Core Infrastructure**: Layout, navigation, authentication, theming
- **Forms & Input**: Healthcare-optimized inputs, dynamic form builder, WYSIWYG
- **Data Management**: Tables, loading states, error handling
- **Healthcare Specific**: Patient inputs, vital signs, medication components

## File Layout
```
component.tsx           # Web (Material-UI)
component_shared.tsx    # Shared business logic
types.ts                # Types
hooks.ts                # Hooks
```
(`component.native.tsx` files no longer exist; do not add new ones.)

## Healthcare Form System
- Dynamic healthcare form builder with conditional logic
- Medical data input validation (vitals, medications, diagnoses)
- Cross-platform medical input components

## Development Patterns
- Component templates with mandatory structure
- Healthcare data handling with PHI protection
- Accessibility-first design patterns
- Cross-platform export strategies

## Dependencies
- React 17+, Material-UI v5
- All `@tellescope/` type and utility packages