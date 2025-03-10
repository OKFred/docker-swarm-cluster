import type { ParameterLocation, ParameterObject, SchemaObjectType } from "openapi3-ts/oas31";

/**
 * @description This function is used to convert the schema object to the parameter object
 */
export default function schemaToParam(
    obj: {
        type?: string;
        properties?: {
            [key: string]: {
                type: SchemaObjectType;
                description?: string;
                examples?: string[];
            };
        };
        required?: string[];
    },
    reqType: ParameterLocation,
): ParameterObject[] {
    const { properties, required } = obj;
    const arr: ParameterObject[] = [];
    if (!properties) return [];
    for (const [k, v] of Object.entries(properties)) {
        const isRequired = required && !!required.find((s) => s === k);
        const { description, examples, ...schema } = v;
        arr.push({
            name: k,
            in: reqType,
            required: isRequired,
            description,
            schema,
            example: examples?.[0],
        });
    }
    return arr;
}
