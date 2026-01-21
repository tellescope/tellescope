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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as fs from 'fs';
import * as path from 'path';
import { schema } from './schema';
// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Convert a model name to PascalCase
 */
function pascalCase(str) {
    return str
        .split('_')
        .map(function (s) { return s.charAt(0).toUpperCase() + s.slice(1); })
        .join('');
}
/**
 * Convert underscores to hyphens for URL-safe paths (matching url_safe_path from utilities)
 */
function urlSafePath(p) {
    return p.replace(/_/g, '-');
}
/**
 * Get the singular form of a model name for URL paths
 */
function getSingularName(modelName) {
    var safeName = urlSafePath(modelName);
    // Remove trailing 's' for singular
    return safeName.endsWith('s') ? safeName.slice(0, -1) : safeName;
}
/**
 * Get the plural form of a model name for URL paths
 */
function getPluralName(modelName) {
    return urlSafePath(modelName);
}
// ============================================================================
// Validator to OpenAPI Type Mapping
// ============================================================================
/**
 * Convert a Tellescope validator to an OpenAPI schema type
 */
function validatorToOpenAPIType(validator) {
    try {
        var typeInfo = validator.getType();
        var example = validator.getExample();
        // Handle primitive string types
        if (typeInfo === 'string') {
            return { type: 'string', example: typeof example === 'string' ? example : undefined };
        }
        if (typeInfo === 'number') {
            return { type: 'number', example: typeof example === 'number' ? example : undefined };
        }
        if (typeInfo === 'boolean') {
            return { type: 'boolean', example: typeof example === 'boolean' ? example : undefined };
        }
        if (typeInfo === 'Date') {
            return { type: 'string', format: 'date-time', example: typeof example === 'string' ? example : undefined };
        }
        // Handle arrays - getType() returns [innerType] or [example]
        if (Array.isArray(typeInfo)) {
            var innerExample = typeInfo[0];
            // Check if it's a primitive array
            if (typeof innerExample === 'string') {
                // It's an array of strings
                return {
                    type: 'array',
                    items: { type: 'string' },
                    example: Array.isArray(example) ? example : undefined
                };
            }
            if (typeof innerExample === 'number') {
                return {
                    type: 'array',
                    items: { type: 'number' },
                    example: Array.isArray(example) ? example : undefined
                };
            }
            if (typeof innerExample === 'boolean') {
                return {
                    type: 'array',
                    items: { type: 'boolean' },
                    example: Array.isArray(example) ? example : undefined
                };
            }
            if (typeof innerExample === 'object' && innerExample !== null) {
                return {
                    type: 'array',
                    items: objectTypeToSchema(innerExample),
                    example: Array.isArray(example) ? example : undefined
                };
            }
            // Fallback for arrays
            return {
                type: 'array',
                items: { type: 'string' },
                example: Array.isArray(example) ? example : undefined
            };
        }
        // Handle objects - getType() returns { field: type, ... }
        if (typeof typeInfo === 'object' && typeInfo !== null) {
            return objectTypeToSchema(typeInfo, example);
        }
        // Fallback for unknown types
        return { type: 'object', additionalProperties: true };
    }
    catch (e) {
        // If validator doesn't have getType/getExample, return generic type
        return { type: 'object', additionalProperties: true };
    }
}
/**
 * Convert an object type definition to OpenAPI schema
 */
function objectTypeToSchema(typeObj, example) {
    var properties = {};
    for (var _i = 0, _a = Object.entries(typeObj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (typeof value === 'string') {
            // Direct type string
            if (value === 'string') {
                properties[key] = { type: 'string' };
            }
            else if (value === 'number') {
                properties[key] = { type: 'number' };
            }
            else if (value === 'boolean') {
                properties[key] = { type: 'boolean' };
            }
            else if (value === 'Date') {
                properties[key] = { type: 'string', format: 'date-time' };
            }
            else {
                // Treat as string enum value or literal
                properties[key] = { type: 'string' };
            }
        }
        else if (typeof value === 'number') {
            properties[key] = { type: 'number', example: value };
        }
        else if (typeof value === 'boolean') {
            properties[key] = { type: 'boolean', example: value };
        }
        else if (Array.isArray(value)) {
            // Array type
            var innerType = value[0];
            if (typeof innerType === 'string') {
                properties[key] = { type: 'array', items: { type: 'string' } };
            }
            else if (typeof innerType === 'number') {
                properties[key] = { type: 'array', items: { type: 'number' } };
            }
            else if (typeof innerType === 'object' && innerType !== null) {
                properties[key] = { type: 'array', items: objectTypeToSchema(innerType) };
            }
            else {
                properties[key] = { type: 'array', items: { type: 'string' } };
            }
        }
        else if (typeof value === 'object' && value !== null) {
            // Nested object
            properties[key] = objectTypeToSchema(value);
        }
    }
    return {
        type: 'object',
        properties: properties,
        example: typeof example === 'object' ? example : undefined
    };
}
// ============================================================================
// Schema Component Generators
// ============================================================================
/**
 * Generate the full model schema for responses (includes all fields except redacted)
 */
function generateModelSchema(modelName, fields) {
    var _a, _b;
    var properties = {};
    var required = [];
    // Add id field
    properties['id'] = {
        type: 'string',
        description: 'Unique identifier',
        pattern: '^[0-9a-fA-F]{24}$'
    };
    for (var _i = 0, _c = Object.entries(fields); _i < _c.length; _i++) {
        var _d = _c[_i], fieldName = _d[0], fieldInfo = _d[1];
        var info = fieldInfo;
        // Skip fields redacted for all users
        if ((_a = info.redactions) === null || _a === void 0 ? void 0 : _a.includes('all'))
            continue;
        // Skip internal _id field (we use 'id' instead)
        if (fieldName === '_id')
            continue;
        try {
            var schema_1 = validatorToOpenAPIType(info.validator);
            // Add description for redacted fields
            if ((_b = info.redactions) === null || _b === void 0 ? void 0 : _b.includes('enduser')) {
                schema_1.description = 'Not visible to endusers';
            }
            properties[fieldName] = schema_1;
            if (info.required) {
                required.push(fieldName);
            }
        }
        catch (e) {
            // Skip fields with invalid validators
            properties[fieldName] = { type: 'object', additionalProperties: true };
        }
    }
    return {
        type: 'object',
        properties: properties,
        required: required.length > 0 ? required : undefined
    };
}
/**
 * Generate schema for create operations (excludes readonly fields)
 */
function generateCreateSchema(modelName, fields) {
    var _a;
    var properties = {};
    var required = [];
    for (var _i = 0, _b = Object.entries(fields); _i < _b.length; _i++) {
        var _c = _b[_i], fieldName = _c[0], fieldInfo = _c[1];
        var info = fieldInfo;
        // Skip readonly fields for create
        if (info.readonly)
            continue;
        // Skip fields redacted for all users
        if ((_a = info.redactions) === null || _a === void 0 ? void 0 : _a.includes('all'))
            continue;
        // Skip internal fields
        if (fieldName === '_id')
            continue;
        try {
            properties[fieldName] = validatorToOpenAPIType(info.validator);
            if (info.required) {
                required.push(fieldName);
            }
        }
        catch (e) {
            properties[fieldName] = { type: 'object', additionalProperties: true };
        }
    }
    return {
        type: 'object',
        properties: properties,
        required: required.length > 0 ? required : undefined
    };
}
/**
 * Generate schema for update operations (excludes readonly and updatesDisabled fields)
 */
function generateUpdateSchema(modelName, fields) {
    var _a;
    var properties = {};
    for (var _i = 0, _b = Object.entries(fields); _i < _b.length; _i++) {
        var _c = _b[_i], fieldName = _c[0], fieldInfo = _c[1];
        var info = fieldInfo;
        // Skip readonly fields
        if (info.readonly)
            continue;
        // Skip fields where updates are disabled
        if (info.updatesDisabled)
            continue;
        // Skip fields redacted for all users
        if ((_a = info.redactions) === null || _a === void 0 ? void 0 : _a.includes('all'))
            continue;
        // Skip internal fields
        if (fieldName === '_id')
            continue;
        try {
            properties[fieldName] = validatorToOpenAPIType(info.validator);
        }
        catch (e) {
            properties[fieldName] = { type: 'object', additionalProperties: true };
        }
    }
    return {
        type: 'object',
        properties: properties,
        description: 'Fields to update (all optional)'
    };
}
/**
 * Generate all schema components
 */
function generateComponents() {
    var schemas = {};
    for (var _i = 0, _a = Object.entries(schema); _i < _a.length; _i++) {
        var _b = _a[_i], modelName = _b[0], modelDef = _b[1];
        var model = modelDef;
        var pascalName = pascalCase(modelName);
        // Generate full model schema (for responses)
        schemas[pascalName] = generateModelSchema(modelName, model.fields);
        // Generate create schema
        schemas["".concat(pascalName, "Create")] = generateCreateSchema(modelName, model.fields);
        // Generate update schema
        schemas["".concat(pascalName, "Update")] = generateUpdateSchema(modelName, model.fields);
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
    };
    schemas['ObjectId'] = {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$',
        description: 'MongoDB ObjectId',
        example: '60398b0231a295e64f084fd9'
    };
    return schemas;
}
// ============================================================================
// Path Generators
// ============================================================================
/**
 * Get common query parameters for readMany operations
 */
function getReadManyParameters() {
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
    ];
}
/**
 * Generate default CRUD operation paths for a model
 */
function generateDefaultOperationPaths(modelName, model) {
    var _a;
    var paths = {};
    var singular = getSingularName(modelName);
    var plural = getPluralName(modelName);
    var pascalName = pascalCase(modelName);
    var defaultActions = model.defaultActions || {};
    var description = ((_a = model.info) === null || _a === void 0 ? void 0 : _a.description) || "".concat(pascalName, " resource");
    // CREATE: POST /v1/{singular}
    if (defaultActions.create !== undefined) {
        var pathKey = "/v1/".concat(singular);
        paths[pathKey] = paths[pathKey] || {};
        paths[pathKey].post = {
            summary: "Create ".concat(singular),
            description: "Creates a new ".concat(singular, ". ").concat(description),
            tags: [pascalName],
            operationId: "create".concat(pascalName),
            security: [{ bearerAuth: [] }, { apiKey: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: "#/components/schemas/".concat(pascalName, "Create") }
                    }
                }
            },
            responses: {
                '200': {
                    description: "Created ".concat(singular),
                    content: {
                        'application/json': {
                            schema: { $ref: "#/components/schemas/".concat(pascalName) }
                        }
                    }
                },
                '400': { $ref: '#/components/responses/BadRequest' },
                '401': { $ref: '#/components/responses/Unauthorized' }
            }
        };
    }
    // CREATE_MANY: POST /v1/{plural}
    if (defaultActions.createMany !== undefined) {
        var pathKey = "/v1/".concat(plural);
        paths[pathKey] = paths[pathKey] || {};
        paths[pathKey].post = {
            summary: "Create multiple ".concat(plural),
            description: "Creates multiple ".concat(plural, " in a single request"),
            tags: [pascalName],
            operationId: "createMany".concat(pascalName),
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
                                    items: { $ref: "#/components/schemas/".concat(pascalName, "Create") },
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
                    description: "Created ".concat(plural),
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    created: {
                                        type: 'array',
                                        items: { $ref: "#/components/schemas/".concat(pascalName) }
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
        };
    }
    // READ by ID: GET /v1/{singular}/{id}
    if (defaultActions.read !== undefined) {
        var pathKey = "/v1/".concat(singular, "/{id}");
        paths[pathKey] = paths[pathKey] || {};
        paths[pathKey].get = {
            summary: "Get ".concat(singular, " by ID"),
            description: "Retrieves a single ".concat(singular, " by its ID"),
            tags: [pascalName],
            operationId: "get".concat(pascalName, "ById"),
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
                    description: "".concat(pascalName, " record"),
                    content: {
                        'application/json': {
                            schema: { $ref: "#/components/schemas/".concat(pascalName) }
                        }
                    }
                },
                '401': { $ref: '#/components/responses/Unauthorized' },
                '404': { $ref: '#/components/responses/NotFound' }
            }
        };
    }
    // READ_MANY: GET /v1/{plural}
    if (defaultActions.readMany !== undefined) {
        var pathKey = "/v1/".concat(plural);
        paths[pathKey] = paths[pathKey] || {};
        paths[pathKey].get = {
            summary: "List ".concat(plural),
            description: "Retrieves a list of ".concat(plural, " with optional filtering and pagination"),
            tags: [pascalName],
            operationId: "list".concat(pascalName),
            security: [{ bearerAuth: [] }, { apiKey: [] }],
            parameters: getReadManyParameters(),
            responses: {
                '200': {
                    description: "List of ".concat(plural),
                    content: {
                        'application/json': {
                            schema: {
                                oneOf: [
                                    {
                                        type: 'array',
                                        items: { $ref: "#/components/schemas/".concat(pascalName) }
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
        };
    }
    // UPDATE: PATCH /v1/{singular}/{id}
    if (defaultActions.update !== undefined) {
        var pathKey = "/v1/".concat(singular, "/{id}");
        paths[pathKey] = paths[pathKey] || {};
        paths[pathKey].patch = {
            summary: "Update ".concat(singular),
            description: "Updates a ".concat(singular, " by ID"),
            tags: [pascalName],
            operationId: "update".concat(pascalName),
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
                                updates: { $ref: "#/components/schemas/".concat(pascalName, "Update") },
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
                    description: "Updated ".concat(singular),
                    content: {
                        'application/json': {
                            schema: { $ref: "#/components/schemas/".concat(pascalName) }
                        }
                    }
                },
                '400': { $ref: '#/components/responses/BadRequest' },
                '401': { $ref: '#/components/responses/Unauthorized' },
                '404': { $ref: '#/components/responses/NotFound' }
            }
        };
    }
    // DELETE: DELETE /v1/{singular}/{id}
    if (defaultActions.delete !== undefined) {
        var pathKey = "/v1/".concat(singular, "/{id}");
        paths[pathKey] = paths[pathKey] || {};
        paths[pathKey].delete = {
            summary: "Delete ".concat(singular),
            description: "Deletes a ".concat(singular, " by ID"),
            tags: [pascalName],
            operationId: "delete".concat(pascalName),
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
        };
    }
    return paths;
}
/**
 * Map CRUD access type to default HTTP method
 */
function getDefaultMethodForAccess(access) {
    switch (access) {
        case 'create': return 'post';
        case 'read': return 'get';
        case 'update': return 'patch';
        case 'delete': return 'delete';
        default: return 'post';
    }
}
/**
 * Generate paths for custom actions
 */
function generateCustomActionPaths(modelName, customActions) {
    var paths = {};
    var singular = getSingularName(modelName);
    var pascalName = pascalCase(modelName);
    for (var _i = 0, _a = Object.entries(customActions); _i < _a.length; _i++) {
        var _b = _a[_i], actionName = _b[0], action = _b[1];
        // Determine the path
        var actionPath = void 0;
        if (action.path) {
            actionPath = action.path.startsWith('/v1') ? action.path : "/v1".concat(action.path);
        }
        else {
            // Generate path from action name
            var safeName = actionName.replace(/_/g, '-');
            actionPath = "/v1/".concat(singular, "/").concat(safeName);
        }
        // Determine HTTP method
        var method = (action.method || getDefaultMethodForAccess(action.access)).toLowerCase();
        if (!['get', 'post', 'patch', 'put', 'delete'].includes(method))
            continue;
        // Build operation
        var operation = {
            summary: action.name || actionName.replace(/_/g, ' '),
            description: buildActionDescription(action),
            tags: [pascalName],
            operationId: "".concat(modelName, "_").concat(actionName),
            security: action.enduserOnly
                ? [{ enduserAuth: [] }]
                : [{ bearerAuth: [] }, { apiKey: [] }],
            responses: {}
        };
        // Add admin-only note
        if (action.adminOnly) {
            operation.description = "**Admin only.** ".concat(operation.description || '');
        }
        if (action.rootAdminOnly) {
            operation.description = "**Root admin only.** ".concat(operation.description || '');
        }
        // Generate parameters
        var _c = generateActionParameters(action, method, actionPath), pathParams = _c.pathParams, queryParams = _c.queryParams, bodySchema = _c.bodySchema;
        if (pathParams.length > 0 || queryParams.length > 0) {
            operation.parameters = __spreadArray(__spreadArray([], pathParams, true), queryParams, true);
        }
        if (bodySchema && ['post', 'patch', 'put'].includes(method)) {
            operation.requestBody = {
                required: true,
                content: {
                    'application/json': { schema: bodySchema }
                }
            };
        }
        // Generate responses
        operation.responses = generateActionResponses(action, pascalName);
        // Add to paths
        paths[actionPath] = paths[actionPath] || {};
        paths[actionPath][method] = operation;
    }
    return paths;
}
/**
 * Build description for a custom action including warnings and notes
 */
function buildActionDescription(action) {
    var description = action.description || '';
    if (action.warnings && action.warnings.length > 0) {
        description += '\n\n**Warnings:**\n' + action.warnings.map(function (w) { return "- ".concat(w); }).join('\n');
    }
    if (action.notes && action.notes.length > 0) {
        description += '\n\n**Notes:**\n' + action.notes.map(function (n) { return "- ".concat(n); }).join('\n');
    }
    return description.trim();
}
/**
 * Generate parameters for a custom action
 */
function generateActionParameters(action, method, actionPath) {
    var pathParams = [];
    var queryParams = [];
    var bodyProperties = {};
    var requiredBody = [];
    // Extract path parameters from the path
    var pathParamMatches = actionPath.match(/\{(\w+)\}/g) || [];
    var pathParamNames = pathParamMatches.map(function (m) { return m.slice(1, -1); });
    // Process action parameters
    if (action.parameters) {
        for (var _i = 0, _a = Object.entries(action.parameters); _i < _a.length; _i++) {
            var _b = _a[_i], paramName = _b[0], paramInfo = _b[1];
            var info = paramInfo;
            try {
                var schema_2 = validatorToOpenAPIType(info.validator);
                if (pathParamNames.includes(paramName)) {
                    pathParams.push({
                        name: paramName,
                        in: 'path',
                        required: true,
                        schema: schema_2
                    });
                }
                else if (method === 'get' || method === 'delete') {
                    // GET/DELETE use query parameters
                    queryParams.push({
                        name: paramName,
                        in: 'query',
                        required: !!info.required,
                        schema: schema_2
                    });
                }
                else {
                    // POST/PATCH/PUT use request body
                    bodyProperties[paramName] = schema_2;
                    if (info.required) {
                        requiredBody.push(paramName);
                    }
                }
            }
            catch (e) {
                // Skip parameters with invalid validators
                bodyProperties[paramName] = { type: 'object', additionalProperties: true };
            }
        }
    }
    var bodySchema = Object.keys(bodyProperties).length > 0
        ? {
            type: 'object',
            properties: bodyProperties,
            required: requiredBody.length > 0 ? requiredBody : undefined
        }
        : null;
    return { pathParams: pathParams, queryParams: queryParams, bodySchema: bodySchema };
}
/**
 * Generate response schemas for a custom action
 */
function generateActionResponses(action, pascalName) {
    var responses = {
        '400': { $ref: '#/components/responses/BadRequest' },
        '401': { $ref: '#/components/responses/Unauthorized' }
    };
    // Handle returns field
    if (!action.returns) {
        responses['200'] = { description: 'Success' };
        return responses;
    }
    // Handle string reference to a model (e.g., returns: 'meeting')
    if (typeof action.returns === 'string') {
        var modelRef = pascalCase(action.returns);
        responses['200'] = {
            description: 'Success',
            content: {
                'application/json': {
                    schema: { $ref: "#/components/schemas/".concat(modelRef) }
                }
            }
        };
        return responses;
    }
    // Handle empty object
    if (typeof action.returns === 'object' && Object.keys(action.returns).length === 0) {
        responses['200'] = { description: 'Success' };
        return responses;
    }
    // Check if returns has a 'validator' property directly (single field return type)
    if (typeof action.returns === 'object' && 'validator' in action.returns) {
        var returnInfo = action.returns;
        try {
            responses['200'] = {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: validatorToOpenAPIType(returnInfo.validator)
                    }
                }
            };
        }
        catch (e) {
            responses['200'] = { description: 'Success' };
        }
        return responses;
    }
    // Returns is ModelFields (object with multiple fields)
    var properties = {};
    var required = [];
    for (var _i = 0, _a = Object.entries(action.returns); _i < _a.length; _i++) {
        var _b = _a[_i], fieldName = _b[0], fieldInfo = _b[1];
        // Skip if fieldInfo is not an object with validator
        if (typeof fieldInfo !== 'object' || fieldInfo === null)
            continue;
        var info = fieldInfo;
        // Check if this field has a validator
        if (!info.validator) {
            properties[fieldName] = { type: 'object', additionalProperties: true };
            continue;
        }
        try {
            properties[fieldName] = validatorToOpenAPIType(info.validator);
            if (info.required) {
                required.push(fieldName);
            }
        }
        catch (e) {
            properties[fieldName] = { type: 'object', additionalProperties: true };
        }
    }
    if (Object.keys(properties).length === 0) {
        responses['200'] = { description: 'Success' };
    }
    else {
        responses['200'] = {
            description: 'Success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: properties,
                        required: required.length > 0 ? required : undefined
                    }
                }
            }
        };
    }
    return responses;
}
/**
 * Merge path items, combining operations from multiple sources
 */
function mergePaths(existing, newPaths) {
    var result = __assign({}, existing);
    for (var _i = 0, _a = Object.entries(newPaths); _i < _a.length; _i++) {
        var _b = _a[_i], pathKey = _b[0], methods = _b[1];
        if (result[pathKey]) {
            result[pathKey] = __assign(__assign({}, result[pathKey]), methods);
        }
        else {
            result[pathKey] = methods;
        }
    }
    return result;
}
// ============================================================================
// Security Schemes
// ============================================================================
function generateSecuritySchemes() {
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
    };
}
// ============================================================================
// Main Generator
// ============================================================================
/**
 * Generate the complete OpenAPI specification
 */
function generateOpenAPISpec() {
    var _a;
    var spec = {
        openapi: '3.0.3',
        info: {
            title: 'Tellescope API',
            version: '1.0.0',
            description: "Healthcare platform API for patient management, communications, and automation.\n\n## Authentication\n\nThe API supports multiple authentication methods:\n\n- **Bearer Token (JWT)**: Obtain a token via login and pass as `Authorization: Bearer <token>`\n- **API Key**: Pass as header `Authorization: API_KEY <key>`\n\n## Pagination\n\nList endpoints use cursor-based pagination:\n- `limit`: Maximum records to return (default varies, max 1000)\n- `lastId`: ID of the last record from previous page\n\n## Filtering\n\nUse the `mdbFilter` query parameter with JSON-encoded MongoDB-style queries:\n```\n?mdbFilter={\"status\":\"active\",\"priority\":{\"$in\":[\"high\",\"urgent\"]}}\n```\n\nSupported operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$exists`, `$or`, `$and`\n",
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
    };
    // Generate schemas
    spec.components.schemas = generateComponents();
    // Generate paths for each model
    for (var _i = 0, _b = Object.entries(schema); _i < _b.length; _i++) {
        var _c = _b[_i], modelName = _c[0], modelDef = _c[1];
        var model = modelDef;
        // Add tag for this model
        spec.tags.push({
            name: pascalCase(modelName),
            description: ((_a = model.info) === null || _a === void 0 ? void 0 : _a.description) || "".concat(pascalCase(modelName), " resource operations")
        });
        // Generate default CRUD paths
        var crudPaths = generateDefaultOperationPaths(modelName, model);
        spec.paths = mergePaths(spec.paths, crudPaths);
        // Generate custom action paths
        if (model.customActions && Object.keys(model.customActions).length > 0) {
            var customPaths = generateCustomActionPaths(modelName, model.customActions);
            spec.paths = mergePaths(spec.paths, customPaths);
        }
    }
    // Sort tags alphabetically
    spec.tags.sort(function (a, b) { return a.name.localeCompare(b.name); });
    // Sort paths alphabetically
    var sortedPaths = {};
    for (var _d = 0, _e = Object.keys(spec.paths).sort(); _d < _e.length; _d++) {
        var key = _e[_d];
        sortedPaths[key] = spec.paths[key];
    }
    spec.paths = sortedPaths;
    return spec;
}
// ============================================================================
// CLI Execution
// ============================================================================
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var spec, outputPath, absolutePath, pathCount, schemaCount, tagCount;
        return __generator(this, function (_a) {
            console.log('Generating OpenAPI specification from Tellescope schema...\n');
            spec = generateOpenAPISpec();
            outputPath = process.argv[2] || path.join(__dirname, '..', 'openapi.json');
            absolutePath = path.isAbsolute(outputPath) ? outputPath : path.resolve(process.cwd(), outputPath);
            // Write the spec
            fs.writeFileSync(absolutePath, JSON.stringify(spec, null, 2), 'utf-8');
            pathCount = Object.keys(spec.paths).length;
            schemaCount = Object.keys(spec.components.schemas).length;
            tagCount = spec.tags.length;
            console.log('OpenAPI specification generated successfully!');
            console.log("  Output: ".concat(absolutePath));
            console.log("  Paths: ".concat(pathCount));
            console.log("  Schemas: ".concat(schemaCount));
            console.log("  Tags (models): ".concat(tagCount));
            return [2 /*return*/];
        });
    });
}
// Run if executed directly
if (require.main === module) {
    main().catch(function (err) {
        console.error('Error generating OpenAPI spec:', err);
        process.exit(1);
    });
}
// Export for programmatic use
export { generateOpenAPISpec };
//# sourceMappingURL=generate-openapi.js.map