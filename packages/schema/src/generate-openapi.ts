#!/usr/bin/env npx ts-node
/**
 * OpenAPI 3.0 Specification Generator for Tellescope API
 *
 * This script generates an OpenAPI 3.0 JSON specification from the Tellescope schema.
 * It reads the schema definitions and produces a complete API documentation.
 *
 * Usage:
 *   cd packages/public/schema
 *   npx ts-node src/generate-openapi.ts [output-path]
 *
 *   Default output: ./openapi.json
 */

import * as fs from 'fs'
import * as path from 'path'
import { schema, Model, ModelFields, ModelFieldInfo, CustomAction } from './schema'
import { ValidatorDefinition } from '@tellescope/validation'

// ============================================================================
// OpenAPI Type Definitions
// ============================================================================

interface OpenAPISchemaType {
  type?: string
  format?: string
  items?: OpenAPISchemaType
  properties?: Record<string, OpenAPISchemaType>
  additionalProperties?: OpenAPISchemaType | boolean
  $ref?: string
  oneOf?: OpenAPISchemaType[]
  anyOf?: OpenAPISchemaType[]
  example?: any
  required?: string[]
  nullable?: boolean
  description?: string
  enum?: string[]
  pattern?: string
  minimum?: number
  maximum?: number
}

interface OpenAPIParameter {
  name: string
  in: 'path' | 'query' | 'header' | 'cookie'
  required?: boolean
  schema: OpenAPISchemaType
  description?: string
}

interface OpenAPIRequestBody {
  required?: boolean
  content: {
    'application/json': {
      schema: OpenAPISchemaType
    }
  }
}

interface OpenAPIResponse {
  description: string
  content?: {
    'application/json': {
      schema: OpenAPISchemaType
    }
  }
}

interface OpenAPIOperation {
  summary?: string
  description?: string
  tags?: string[]
  operationId?: string
  security?: Array<Record<string, string[]>>
  parameters?: OpenAPIParameter[]
  requestBody?: OpenAPIRequestBody
  responses: Record<string, OpenAPIResponse | { $ref: string }>
}

interface OpenAPIPathItem {
  get?: OpenAPIOperation
  post?: OpenAPIOperation
  patch?: OpenAPIOperation
  put?: OpenAPIOperation
  delete?: OpenAPIOperation
}

interface OpenAPISpec {
  openapi: string
  info: {
    title: string
    version: string
    description: string
    contact?: { email?: string; url?: string }
  }
  servers: Array<{ url: string; description: string }>
  paths: Record<string, OpenAPIPathItem>
  components: {
    schemas: Record<string, OpenAPISchemaType>
    securitySchemes: Record<string, any>
    responses: Record<string, OpenAPIResponse>
  }
  tags: Array<{ name: string; description?: string }>
  security: Array<Record<string, string[]>>
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert a model name to PascalCase
 */
function pascalCase(str: string): string {
  return str
    .split('_')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

/**
 * Convert underscores to hyphens for URL-safe paths (matching url_safe_path from utilities)
 */
function urlSafePath(p: string): string {
  return p.replace(/_/g, '-')
}

/**
 * Get the singular form of a model name for URL paths
 */
function getSingularName(modelName: string): string {
  const safeName = urlSafePath(modelName)
  // Remove trailing 's' for singular
  return safeName.endsWith('s') ? safeName.slice(0, -1) : safeName
}

/**
 * Get the plural form of a model name for URL paths
 */
function getPluralName(modelName: string): string {
  return urlSafePath(modelName)
}

// ============================================================================
// Validator to OpenAPI Type Mapping
// ============================================================================

/**
 * Convert a Tellescope validator to an OpenAPI schema type
 */
function validatorToOpenAPIType(validator: ValidatorDefinition<any>): OpenAPISchemaType {
  try {
    const typeInfo = validator.getType()
    const example = validator.getExample()

    // Handle primitive string types
    if (typeInfo === 'string') {
      return { type: 'string', example: typeof example === 'string' ? example : undefined }
    }
    if (typeInfo === 'number') {
      return { type: 'number', example: typeof example === 'number' ? example : undefined }
    }
    if (typeInfo === 'boolean') {
      return { type: 'boolean', example: typeof example === 'boolean' ? example : undefined }
    }
    if (typeInfo === 'Date') {
      return { type: 'string', format: 'date-time', example: typeof example === 'string' ? example : undefined }
    }

    // Handle arrays - getType() returns [innerType] or [example]
    if (Array.isArray(typeInfo)) {
      const innerExample = typeInfo[0]

      // Check if it's a primitive array
      if (typeof innerExample === 'string') {
        // It's an array of strings
        return {
          type: 'array',
          items: { type: 'string' },
          example: Array.isArray(example) ? example : undefined
        }
      }
      if (typeof innerExample === 'number') {
        return {
          type: 'array',
          items: { type: 'number' },
          example: Array.isArray(example) ? example : undefined
        }
      }
      if (typeof innerExample === 'boolean') {
        return {
          type: 'array',
          items: { type: 'boolean' },
          example: Array.isArray(example) ? example : undefined
        }
      }
      if (typeof innerExample === 'object' && innerExample !== null) {
        return {
          type: 'array',
          items: objectTypeToSchema(innerExample),
          example: Array.isArray(example) ? example : undefined
        }
      }

      // Fallback for arrays
      return {
        type: 'array',
        items: { type: 'string' },
        example: Array.isArray(example) ? example : undefined
      }
    }

    // Handle objects - getType() returns { field: type, ... }
    if (typeof typeInfo === 'object' && typeInfo !== null) {
      return objectTypeToSchema(typeInfo, example)
    }

    // Fallback for unknown types
    return { type: 'object', additionalProperties: true }
  } catch (e) {
    // If validator doesn't have getType/getExample, return generic type
    return { type: 'object', additionalProperties: true }
  }
}

/**
 * Convert an object type definition to OpenAPI schema
 */
function objectTypeToSchema(typeObj: Record<string, any>, example?: any): OpenAPISchemaType {
  const properties: Record<string, OpenAPISchemaType> = {}

  for (const [key, value] of Object.entries(typeObj)) {
    if (typeof value === 'string') {
      // Direct type string
      if (value === 'string') {
        properties[key] = { type: 'string' }
      } else if (value === 'number') {
        properties[key] = { type: 'number' }
      } else if (value === 'boolean') {
        properties[key] = { type: 'boolean' }
      } else if (value === 'Date') {
        properties[key] = { type: 'string', format: 'date-time' }
      } else {
        // Treat as string enum value or literal
        properties[key] = { type: 'string' }
      }
    } else if (typeof value === 'number') {
      properties[key] = { type: 'number', example: value }
    } else if (typeof value === 'boolean') {
      properties[key] = { type: 'boolean', example: value }
    } else if (Array.isArray(value)) {
      // Array type
      const innerType = value[0]
      if (typeof innerType === 'string') {
        properties[key] = { type: 'array', items: { type: 'string' } }
      } else if (typeof innerType === 'number') {
        properties[key] = { type: 'array', items: { type: 'number' } }
      } else if (typeof innerType === 'object' && innerType !== null) {
        properties[key] = { type: 'array', items: objectTypeToSchema(innerType) }
      } else {
        properties[key] = { type: 'array', items: { type: 'string' } }
      }
    } else if (typeof value === 'object' && value !== null) {
      // Nested object
      properties[key] = objectTypeToSchema(value)
    }
  }

  return {
    type: 'object',
    properties,
    example: typeof example === 'object' ? example : undefined
  }
}

// ============================================================================
// Schema Component Generators
// ============================================================================

/**
 * Generate the full model schema for responses (includes all fields except redacted)
 */
function generateModelSchema(modelName: string, fields: ModelFields<any>): OpenAPISchemaType {
  const properties: Record<string, OpenAPISchemaType> = {}
  const required: string[] = []

  // Add id field
  properties['id'] = {
    type: 'string',
    description: 'Unique identifier',
    pattern: '^[0-9a-fA-F]{24}$'
  }

  for (const [fieldName, fieldInfo] of Object.entries(fields)) {
    const info = fieldInfo as ModelFieldInfo<any, any>

    // Skip fields redacted for all users
    if (info.redactions?.includes('all')) continue

    // Skip internal _id field (we use 'id' instead)
    if (fieldName === '_id') continue

    try {
      const schema = validatorToOpenAPIType(info.validator)

      // Add description for redacted fields
      if (info.redactions?.includes('enduser')) {
        schema.description = 'Not visible to endusers'
      }

      properties[fieldName] = schema

      if (info.required) {
        required.push(fieldName)
      }
    } catch (e) {
      // Skip fields with invalid validators
      properties[fieldName] = { type: 'object', additionalProperties: true }
    }
  }

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined
  }
}

/**
 * Generate schema for create operations (excludes readonly fields)
 */
function generateCreateSchema(modelName: string, fields: ModelFields<any>): OpenAPISchemaType {
  const properties: Record<string, OpenAPISchemaType> = {}
  const required: string[] = []

  for (const [fieldName, fieldInfo] of Object.entries(fields)) {
    const info = fieldInfo as ModelFieldInfo<any, any>

    // Skip readonly fields for create
    if (info.readonly) continue

    // Skip fields redacted for all users
    if (info.redactions?.includes('all')) continue

    // Skip internal fields
    if (fieldName === '_id') continue

    try {
      properties[fieldName] = validatorToOpenAPIType(info.validator)

      if (info.required) {
        required.push(fieldName)
      }
    } catch (e) {
      properties[fieldName] = { type: 'object', additionalProperties: true }
    }
  }

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined
  }
}

/**
 * Generate schema for update operations (excludes readonly and updatesDisabled fields)
 */
function generateUpdateSchema(modelName: string, fields: ModelFields<any>): OpenAPISchemaType {
  const properties: Record<string, OpenAPISchemaType> = {}

  for (const [fieldName, fieldInfo] of Object.entries(fields)) {
    const info = fieldInfo as ModelFieldInfo<any, any>

    // Skip readonly fields
    if (info.readonly) continue

    // Skip fields where updates are disabled
    if (info.updatesDisabled) continue

    // Skip fields redacted for all users
    if (info.redactions?.includes('all')) continue

    // Skip internal fields
    if (fieldName === '_id') continue

    try {
      properties[fieldName] = validatorToOpenAPIType(info.validator)
    } catch (e) {
      properties[fieldName] = { type: 'object', additionalProperties: true }
    }
  }

  return {
    type: 'object',
    properties,
    description: 'Fields to update (all optional)'
  }
}

/**
 * Generate all schema components
 */
function generateComponents(): Record<string, OpenAPISchemaType> {
  const schemas: Record<string, OpenAPISchemaType> = {}

  for (const [modelName, modelDef] of Object.entries(schema)) {
    const model = modelDef as Model<any, any>
    const pascalName = pascalCase(modelName)

    // Generate full model schema (for responses)
    schemas[pascalName] = generateModelSchema(modelName, model.fields)

    // Generate create schema
    schemas[`${pascalName}Create`] = generateCreateSchema(modelName, model.fields)

    // Generate update schema
    schemas[`${pascalName}Update`] = generateUpdateSchema(modelName, model.fields)
  }

  // Add common schemas
  schemas['Error'] = {
    type: 'object',
    properties: {
      message: { type: 'string', description: 'Error message' },
      code: { type: 'integer', description: 'Error code' },
      info: { type: 'object', additionalProperties: true, description: 'Additional error information' }
    },
    required: ['message']
  }

  schemas['ObjectId'] = {
    type: 'string',
    pattern: '^[0-9a-fA-F]{24}$',
    description: 'MongoDB ObjectId',
    example: '60398b0231a295e64f084fd9'
  }

  return schemas
}

// ============================================================================
// Path Generators
// ============================================================================

/**
 * Get common query parameters for readMany operations
 */
function getReadManyParameters(): OpenAPIParameter[] {
  return [
    {
      name: 'limit',
      in: 'query',
      schema: { type: 'integer', minimum: 1, maximum: 1000 },
      description: 'Maximum number of records to return (default varies by model, max 1000)'
    },
    {
      name: 'lastId',
      in: 'query',
      schema: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
      description: 'Cursor for pagination - ID of the last record from previous page'
    },
    {
      name: 'sort',
      in: 'query',
      schema: { type: 'string', enum: ['oldFirst', 'newFirst'] },
      description: 'Sort order by creation date'
    },
    {
      name: 'sortBy',
      in: 'query',
      schema: { type: 'string' },
      description: 'Field to sort by'
    },
    {
      name: 'mdbFilter',
      in: 'query',
      schema: { type: 'string' },
      description: 'JSON-encoded MongoDB-style filter object'
    },
    {
      name: 'search',
      in: 'query',
      schema: { type: 'string' },
      description: 'Text search query'
    },
    {
      name: 'from',
      in: 'query',
      schema: { type: 'string', format: 'date-time' },
      description: 'Filter records created after this date'
    },
    {
      name: 'to',
      in: 'query',
      schema: { type: 'string', format: 'date-time' },
      description: 'Filter records created before this date'
    },
    {
      name: 'fromToField',
      in: 'query',
      schema: { type: 'string' },
      description: 'Field to use for date range filtering (default: createdAt)'
    },
    {
      name: 'ids',
      in: 'query',
      schema: { type: 'string' },
      description: 'Comma-separated list of IDs to filter by'
    },
    {
      name: 'returnCount',
      in: 'query',
      schema: { type: 'boolean' },
      description: 'If true, return only the count of matching records'
    }
  ]
}

/**
 * Generate default CRUD operation paths for a model
 */
function generateDefaultOperationPaths(
  modelName: string,
  model: Model<any, any>
): Record<string, OpenAPIPathItem> {
  const paths: Record<string, OpenAPIPathItem> = {}
  const singular = getSingularName(modelName)
  const plural = getPluralName(modelName)
  const pascalName = pascalCase(modelName)
  const defaultActions = model.defaultActions || {}
  const description = model.info?.description || `${pascalName} resource`

  // CREATE: POST /v1/{singular}
  if (defaultActions.create !== undefined) {
    const pathKey = `/v1/${singular}`
    paths[pathKey] = paths[pathKey] || {}
    paths[pathKey].post = {
      summary: `Create ${singular}`,
      description: `Creates a new ${singular}. ${description}`,
      tags: [pascalName],
      operationId: `create${pascalName}`,
      security: [{ bearerAuth: [] }, { apiKey: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${pascalName}Create` }
          }
        }
      },
      responses: {
        '200': {
          description: `Created ${singular}`,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${pascalName}` }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '401': { $ref: '#/components/responses/Unauthorized' }
      }
    }
  }

  // CREATE_MANY: POST /v1/{plural}
  if (defaultActions.createMany !== undefined) {
    const pathKey = `/v1/${plural}`
    paths[pathKey] = paths[pathKey] || {}
    paths[pathKey].post = {
      summary: `Create multiple ${plural}`,
      description: `Creates multiple ${plural} in a single request`,
      tags: [pascalName],
      operationId: `createMany${pascalName}`,
      security: [{ bearerAuth: [] }, { apiKey: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                create: {
                  type: 'array',
                  items: { $ref: `#/components/schemas/${pascalName}Create` },
                  description: 'Array of records to create'
                }
              },
              required: ['create']
            }
          }
        }
      },
      responses: {
        '200': {
          description: `Created ${plural}`,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  created: {
                    type: 'array',
                    items: { $ref: `#/components/schemas/${pascalName}` }
                  },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        index: { type: 'integer' },
                        error: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '401': { $ref: '#/components/responses/Unauthorized' }
      }
    }
  }

  // READ by ID: GET /v1/{singular}/{id}
  if (defaultActions.read !== undefined) {
    const pathKey = `/v1/${singular}/{id}`
    paths[pathKey] = paths[pathKey] || {}
    paths[pathKey].get = {
      summary: `Get ${singular} by ID`,
      description: `Retrieves a single ${singular} by its ID`,
      tags: [pascalName],
      operationId: `get${pascalName}ById`,
      security: [{ bearerAuth: [] }, { apiKey: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
          description: 'The unique identifier of the record'
        }
      ],
      responses: {
        '200': {
          description: `${pascalName} record`,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${pascalName}` }
            }
          }
        },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '404': { $ref: '#/components/responses/NotFound' }
      }
    }
  }

  // READ_MANY: GET /v1/{plural}
  if (defaultActions.readMany !== undefined) {
    const pathKey = `/v1/${plural}`
    paths[pathKey] = paths[pathKey] || {}
    paths[pathKey].get = {
      summary: `List ${plural}`,
      description: `Retrieves a list of ${plural} with optional filtering and pagination`,
      tags: [pascalName],
      operationId: `list${pascalName}`,
      security: [{ bearerAuth: [] }, { apiKey: [] }],
      parameters: getReadManyParameters(),
      responses: {
        '200': {
          description: `List of ${plural}`,
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    type: 'array',
                    items: { $ref: `#/components/schemas/${pascalName}` }
                  },
                  {
                    type: 'object',
                    properties: {
                      count: { type: 'integer', description: 'Total count when returnCount=true' }
                    }
                  }
                ]
              }
            }
          }
        },
        '401': { $ref: '#/components/responses/Unauthorized' }
      }
    }
  }

  // UPDATE: PATCH /v1/{singular}/{id}
  if (defaultActions.update !== undefined) {
    const pathKey = `/v1/${singular}/{id}`
    paths[pathKey] = paths[pathKey] || {}
    paths[pathKey].patch = {
      summary: `Update ${singular}`,
      description: `Updates a ${singular} by ID`,
      tags: [pascalName],
      operationId: `update${pascalName}`,
      security: [{ bearerAuth: [] }, { apiKey: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
          description: 'The unique identifier of the record to update'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                updates: { $ref: `#/components/schemas/${pascalName}Update` },
                options: {
                  type: 'object',
                  properties: {
                    replaceObjectFields: {
                      type: 'boolean',
                      description: 'If true, replace object fields entirely instead of merging'
                    }
                  }
                }
              },
              required: ['updates']
            }
          }
        }
      },
      responses: {
        '200': {
          description: `Updated ${singular}`,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${pascalName}` }
            }
          }
        },
        '400': { $ref: '#/components/responses/BadRequest' },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '404': { $ref: '#/components/responses/NotFound' }
      }
    }
  }

  // DELETE: DELETE /v1/{singular}/{id}
  if (defaultActions.delete !== undefined) {
    const pathKey = `/v1/${singular}/{id}`
    paths[pathKey] = paths[pathKey] || {}
    paths[pathKey].delete = {
      summary: `Delete ${singular}`,
      description: `Deletes a ${singular} by ID`,
      tags: [pascalName],
      operationId: `delete${pascalName}`,
      security: [{ bearerAuth: [] }, { apiKey: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
          description: 'The unique identifier of the record to delete'
        }
      ],
      responses: {
        '204': { description: 'Successfully deleted' },
        '401': { $ref: '#/components/responses/Unauthorized' },
        '404': { $ref: '#/components/responses/NotFound' }
      }
    }
  }

  return paths
}

/**
 * Map CRUD access type to default HTTP method
 */
function getDefaultMethodForAccess(access: string): string {
  switch (access) {
    case 'create': return 'post'
    case 'read': return 'get'
    case 'update': return 'patch'
    case 'delete': return 'delete'
    default: return 'post'
  }
}

/**
 * Generate paths for custom actions
 */
function generateCustomActionPaths(
  modelName: string,
  customActions: Record<string, CustomAction>
): Record<string, OpenAPIPathItem> {
  const paths: Record<string, OpenAPIPathItem> = {}
  const singular = getSingularName(modelName)
  const pascalName = pascalCase(modelName)

  for (const [actionName, action] of Object.entries(customActions)) {
    // Determine the path
    let actionPath: string
    if (action.path) {
      actionPath = action.path.startsWith('/v1') ? action.path : `/v1${action.path}`
    } else {
      // Generate path from action name
      const safeName = actionName.replace(/_/g, '-')
      actionPath = `/v1/${singular}/${safeName}`
    }

    // Determine HTTP method
    const method = (action.method || getDefaultMethodForAccess(action.access)).toLowerCase()
    if (!['get', 'post', 'patch', 'put', 'delete'].includes(method)) continue

    // Build operation
    const operation: OpenAPIOperation = {
      summary: action.name || actionName.replace(/_/g, ' '),
      description: buildActionDescription(action),
      tags: [pascalName],
      operationId: `${modelName}_${actionName}`,
      security: action.enduserOnly
        ? [{ enduserAuth: [] }]
        : [{ bearerAuth: [] }, { apiKey: [] }],
      responses: {}
    }

    // Add admin-only note
    if (action.adminOnly) {
      operation.description = `**Admin only.** ${operation.description || ''}`
    }
    if (action.rootAdminOnly) {
      operation.description = `**Root admin only.** ${operation.description || ''}`
    }

    // Generate parameters
    const { pathParams, queryParams, bodySchema } = generateActionParameters(
      action,
      method,
      actionPath
    )

    if (pathParams.length > 0 || queryParams.length > 0) {
      operation.parameters = [...pathParams, ...queryParams]
    }

    if (bodySchema && ['post', 'patch', 'put'].includes(method)) {
      operation.requestBody = {
        required: true,
        content: {
          'application/json': { schema: bodySchema }
        }
      }
    }

    // Generate responses
    operation.responses = generateActionResponses(action, pascalName)

    // Add to paths
    paths[actionPath] = paths[actionPath] || {}
    ;(paths[actionPath] as any)[method] = operation
  }

  return paths
}

/**
 * Build description for a custom action including warnings and notes
 */
function buildActionDescription(action: CustomAction): string {
  let description = action.description || ''

  if (action.warnings && action.warnings.length > 0) {
    description += '\n\n**Warnings:**\n' + action.warnings.map(w => `- ${w}`).join('\n')
  }

  if (action.notes && action.notes.length > 0) {
    description += '\n\n**Notes:**\n' + action.notes.map(n => `- ${n}`).join('\n')
  }

  return description.trim()
}

/**
 * Generate parameters for a custom action
 */
function generateActionParameters(
  action: CustomAction,
  method: string,
  actionPath: string
): {
  pathParams: OpenAPIParameter[]
  queryParams: OpenAPIParameter[]
  bodySchema: OpenAPISchemaType | null
} {
  const pathParams: OpenAPIParameter[] = []
  const queryParams: OpenAPIParameter[] = []
  const bodyProperties: Record<string, OpenAPISchemaType> = {}
  const requiredBody: string[] = []

  // Extract path parameters from the path
  const pathParamMatches = actionPath.match(/\{(\w+)\}/g) || []
  const pathParamNames = pathParamMatches.map(m => m.slice(1, -1))

  // Process action parameters
  if (action.parameters) {
    for (const [paramName, paramInfo] of Object.entries(action.parameters)) {
      const info = paramInfo as ModelFieldInfo<any, any>

      try {
        const schema = validatorToOpenAPIType(info.validator)

        if (pathParamNames.includes(paramName)) {
          pathParams.push({
            name: paramName,
            in: 'path',
            required: true,
            schema
          })
        } else if (method === 'get' || method === 'delete') {
          // GET/DELETE use query parameters
          queryParams.push({
            name: paramName,
            in: 'query',
            required: !!info.required,
            schema
          })
        } else {
          // POST/PATCH/PUT use request body
          bodyProperties[paramName] = schema
          if (info.required) {
            requiredBody.push(paramName)
          }
        }
      } catch (e) {
        // Skip parameters with invalid validators
        bodyProperties[paramName] = { type: 'object', additionalProperties: true }
      }
    }
  }

  const bodySchema = Object.keys(bodyProperties).length > 0
    ? {
        type: 'object' as const,
        properties: bodyProperties,
        required: requiredBody.length > 0 ? requiredBody : undefined
      }
    : null

  return { pathParams, queryParams, bodySchema }
}

/**
 * Generate response schemas for a custom action
 */
function generateActionResponses(
  action: CustomAction,
  pascalName: string
): Record<string, OpenAPIResponse | { $ref: string }> {
  const responses: Record<string, OpenAPIResponse | { $ref: string }> = {
    '400': { $ref: '#/components/responses/BadRequest' },
    '401': { $ref: '#/components/responses/Unauthorized' }
  }

  // Handle returns field
  if (!action.returns) {
    responses['200'] = { description: 'Success' }
    return responses
  }

  // Handle string reference to a model (e.g., returns: 'meeting')
  if (typeof action.returns === 'string') {
    const modelRef = pascalCase(action.returns)
    responses['200'] = {
      description: 'Success',
      content: {
        'application/json': {
          schema: { $ref: `#/components/schemas/${modelRef}` }
        }
      }
    }
    return responses
  }

  // Handle empty object
  if (typeof action.returns === 'object' && Object.keys(action.returns).length === 0) {
    responses['200'] = { description: 'Success' }
    return responses
  }

  // Check if returns has a 'validator' property directly (single field return type)
  if (typeof action.returns === 'object' && 'validator' in action.returns) {
    const returnInfo = action.returns as ModelFieldInfo<any, any>
    try {
      responses['200'] = {
        description: 'Success',
        content: {
          'application/json': {
            schema: validatorToOpenAPIType(returnInfo.validator)
          }
        }
      }
    } catch (e) {
      responses['200'] = { description: 'Success' }
    }
    return responses
  }

  // Returns is ModelFields (object with multiple fields)
  const properties: Record<string, OpenAPISchemaType> = {}
  const required: string[] = []

  for (const [fieldName, fieldInfo] of Object.entries(action.returns)) {
    // Skip if fieldInfo is not an object with validator
    if (typeof fieldInfo !== 'object' || fieldInfo === null) continue

    const info = fieldInfo as ModelFieldInfo<any, any>

    // Check if this field has a validator
    if (!info.validator) {
      properties[fieldName] = { type: 'object', additionalProperties: true }
      continue
    }

    try {
      properties[fieldName] = validatorToOpenAPIType(info.validator)
      if (info.required) {
        required.push(fieldName)
      }
    } catch (e) {
      properties[fieldName] = { type: 'object', additionalProperties: true }
    }
  }

  if (Object.keys(properties).length === 0) {
    responses['200'] = { description: 'Success' }
  } else {
    responses['200'] = {
      description: 'Success',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties,
            required: required.length > 0 ? required : undefined
          }
        }
      }
    }
  }

  return responses
}

/**
 * Merge path items, combining operations from multiple sources
 */
function mergePaths(
  existing: Record<string, OpenAPIPathItem>,
  newPaths: Record<string, OpenAPIPathItem>
): Record<string, OpenAPIPathItem> {
  const result = { ...existing }

  for (const [pathKey, methods] of Object.entries(newPaths)) {
    if (result[pathKey]) {
      result[pathKey] = { ...result[pathKey], ...methods }
    } else {
      result[pathKey] = methods
    }
  }

  return result
}

// ============================================================================
// Security Schemes
// ============================================================================

function generateSecuritySchemes(): Record<string, any> {
  return {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT token obtained from user login. Pass as Authorization header: Bearer <token>'
    },
    apiKey: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'API key for service accounts. Pass as Authorization header with format: API_KEY {your_key}'
    },
    enduserAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT token for enduser (patient) authentication'
    }
  }
}

// ============================================================================
// Main Generator
// ============================================================================

/**
 * Generate the complete OpenAPI specification
 */
function generateOpenAPISpec(): OpenAPISpec {
  const spec: OpenAPISpec = {
    openapi: '3.0.3',
    info: {
      title: 'Tellescope API',
      version: '1.0.0',
      description: `Healthcare platform API for patient management, communications, and automation.

## Authentication

The API supports multiple authentication methods:

- **Bearer Token (JWT)**: Obtain a token via login and pass as \`Authorization: Bearer <token>\`
- **API Key**: Pass as header \`Authorization: API_KEY <key>\`

## Pagination

List endpoints use cursor-based pagination:
- \`limit\`: Maximum records to return (default varies, max 1000)
- \`lastId\`: ID of the last record from previous page

## Filtering

Use the \`mdbFilter\` query parameter with JSON-encoded MongoDB-style queries:
\`\`\`
?mdbFilter={"status":"active","priority":{"$in":["high","urgent"]}}
\`\`\`

Supported operators: \`$eq\`, \`$ne\`, \`$gt\`, \`$gte\`, \`$lt\`, \`$lte\`, \`$in\`, \`$nin\`, \`$exists\`, \`$or\`, \`$and\`
`,
      contact: {
        email: 'support@tellescope.com',
        url: 'https://tellescope.com'
      }
    },
    servers: [
      { url: 'https://api.tellescope.com', description: 'Production' },
      { url: 'https://staging-api.tellescope.com', description: 'Staging' }
    ],
    paths: {},
    components: {
      schemas: {},
      securitySchemes: generateSecuritySchemes(),
      responses: {
        BadRequest: {
          description: 'Bad Request - Invalid input or validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        Unauthorized: {
          description: 'Unauthorized - Invalid or missing authentication',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFound: {
          description: 'Not Found - Resource does not exist',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    tags: [],
    security: [{ bearerAuth: [] }, { apiKey: [] }]
  }

  // Generate schemas
  spec.components.schemas = generateComponents()

  // Generate paths for each model
  for (const [modelName, modelDef] of Object.entries(schema)) {
    const model = modelDef as Model<any, any>

    // Add tag for this model
    spec.tags.push({
      name: pascalCase(modelName),
      description: model.info?.description || `${pascalCase(modelName)} resource operations`
    })

    // Generate default CRUD paths
    const crudPaths = generateDefaultOperationPaths(modelName, model)
    spec.paths = mergePaths(spec.paths, crudPaths)

    // Generate custom action paths
    if (model.customActions && Object.keys(model.customActions).length > 0) {
      const customPaths = generateCustomActionPaths(modelName, model.customActions)
      spec.paths = mergePaths(spec.paths, customPaths)
    }
  }

  // Sort tags alphabetically
  spec.tags.sort((a, b) => a.name.localeCompare(b.name))

  // Sort paths alphabetically
  const sortedPaths: Record<string, OpenAPIPathItem> = {}
  for (const key of Object.keys(spec.paths).sort()) {
    sortedPaths[key] = spec.paths[key]
  }
  spec.paths = sortedPaths

  return spec
}

// ============================================================================
// CLI Execution
// ============================================================================

async function main() {
  console.log('Generating OpenAPI specification from Tellescope schema...\n')

  const spec = generateOpenAPISpec()

  // Determine output path
  const outputPath = process.argv[2] || path.join(__dirname, '..', 'openapi.json')
  const absolutePath = path.isAbsolute(outputPath) ? outputPath : path.resolve(process.cwd(), outputPath)

  // Write the spec
  fs.writeFileSync(absolutePath, JSON.stringify(spec, null, 2), 'utf-8')

  // Print summary
  const pathCount = Object.keys(spec.paths).length
  const schemaCount = Object.keys(spec.components.schemas).length
  const tagCount = spec.tags.length

  console.log('OpenAPI specification generated successfully!')
  console.log(`  Output: ${absolutePath}`)
  console.log(`  Paths: ${pathCount}`)
  console.log(`  Schemas: ${schemaCount}`)
  console.log(`  Tags (models): ${tagCount}`)
}

// Run if executed directly
if (require.main === module) {
  main().catch(err => {
    console.error('Error generating OpenAPI spec:', err)
    process.exit(1)
  })
}

// Export for programmatic use
export { generateOpenAPISpec, OpenAPISpec }
