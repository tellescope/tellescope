# Tellescope React Components

## Purpose
Shared UI component library for both React and React Native applications with healthcare-optimized components, consistent design, accessibility, and HIPAA-compliant functionality.

## Key Features
- Cross-platform support (React web + React Native mobile)
- Healthcare-optimized form system with dynamic builders
- HIPAA-compliant authentication and security components
- Accessibility-focused design (WCAG 2.1 AA compliant)
- Real-time capabilities and theming system

## Entry Points
- **Web**: `index.ts` - Material-UI integrated components
- **React Native**: `index.native.ts` - Native mobile components
- **Shared Logic**: `hooks.ts`, `state.tsx` - Cross-platform business logic
- **Specialized**: `Forms/`, `Community/`, `CMS/`, `Calendar/` modules

## Component Categories
- **Core Infrastructure**: Layout, navigation, authentication, theming
- **Forms & Input**: Healthcare-optimized inputs, dynamic form builder, WYSIWYG
- **Data Management**: Tables, loading states, error handling
- **Healthcare Specific**: Patient inputs, vital signs, medication components

## Cross-Platform Architecture
```
component.tsx           # Web (Material-UI)
component.native.tsx    # React Native
component_shared.tsx    # Shared business logic
types.ts               # Cross-platform types
hooks.ts               # Platform-agnostic hooks
```

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
- React 17+, Material-UI v5 (web), React Native
- All `@tellescope/` type and utility packages