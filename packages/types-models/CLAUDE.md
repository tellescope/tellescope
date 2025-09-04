# Tellescope Types - Models

## Purpose
Core TypeScript type definitions for Tellescope's healthcare data models, defining structure and relationships for all healthcare entities.

## Key Features
- Patient management types (Enduser, relationships, observations, medications)
- Care management types (CarePlan, tasks, journeys, automation calendar events)
- Clinical data types (Vital, forms, encounters, diagnoses)
- Provider types (User, Organization, teams, roles)
- Communication types (Email, SMS, chat)

## Entry Points
- **Main**: `src/` - All healthcare data model type definitions
- **Core Models**: Patient-centric data architecture with required audit fields

## Critical Safety Notes
- 🔒 Patient-centric design - most data links to `enduserId`
- ✅ Safe to add new type definitions and extend existing interfaces

## Usage Example
```typescript
import { Enduser, EnduserObservation, CarePlan } from '@tellescope/types-models'

const patient: Enduser = {
  id: '...',
  fname: 'John',
  lname: 'Doe',
  dateOfBirth: '12-20-2001', // MM-DD-YYYY
}