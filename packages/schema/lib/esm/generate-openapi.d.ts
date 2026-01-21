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
interface OpenAPISchemaType {
    type?: string;
    format?: string;
    items?: OpenAPISchemaType;
    properties?: Record<string, OpenAPISchemaType>;
    additionalProperties?: OpenAPISchemaType | boolean;
    $ref?: string;
    oneOf?: OpenAPISchemaType[];
    anyOf?: OpenAPISchemaType[];
    example?: any;
    required?: string[];
    nullable?: boolean;
    description?: string;
    enum?: string[];
    pattern?: string;
    minimum?: number;
    maximum?: number;
}
interface OpenAPIParameter {
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    required?: boolean;
    schema: OpenAPISchemaType;
    description?: string;
}
interface OpenAPIRequestBody {
    required?: boolean;
    content: {
        'application/json': {
            schema: OpenAPISchemaType;
        };
    };
}
interface OpenAPIResponse {
    description: string;
    content?: {
        'application/json': {
            schema: OpenAPISchemaType;
        };
    };
}
interface OpenAPIOperation {
    summary?: string;
    description?: string;
    tags?: string[];
    operationId?: string;
    security?: Array<Record<string, string[]>>;
    parameters?: OpenAPIParameter[];
    requestBody?: OpenAPIRequestBody;
    responses: Record<string, OpenAPIResponse | {
        $ref: string;
    }>;
}
interface OpenAPIPathItem {
    get?: OpenAPIOperation;
    post?: OpenAPIOperation;
    patch?: OpenAPIOperation;
    put?: OpenAPIOperation;
    delete?: OpenAPIOperation;
}
interface OpenAPISpec {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact?: {
            email?: string;
            url?: string;
        };
    };
    servers: Array<{
        url: string;
        description: string;
    }>;
    paths: Record<string, OpenAPIPathItem>;
    components: {
        schemas: Record<string, OpenAPISchemaType>;
        securitySchemes: Record<string, any>;
        responses: Record<string, OpenAPIResponse>;
    };
    tags: Array<{
        name: string;
        description?: string;
    }>;
    security: Array<Record<string, string[]>>;
}
/**
 * Generate the complete OpenAPI specification
 */
declare function generateOpenAPISpec(): OpenAPISpec;
export { generateOpenAPISpec, OpenAPISpec };
//# sourceMappingURL=generate-openapi.d.ts.map