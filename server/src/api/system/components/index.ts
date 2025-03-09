import type { FromSchema, JSONSchema } from "json-schema-to-ts";

export const systemInfoReq = {
    type: "object",
    properties: {} satisfies Partial<Record<string, JSONSchema>>,
    required: [],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const systemInfoRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        data: {
            type: "object",
            properties: {
                ok: { type: "boolean" },
                data: {
                    type: "object",
                    properties: {
                        node: { type: "string" },
                        platform: { type: "string" },
                        arch: { type: "string" },
                        cpus: { type: "integer" },
                        memory: { type: "integer" },
                        uptime: { type: "integer" },
                        loadavg: { type: "array" },
                        totalmem: { type: "integer" },
                        freemem: { type: "integer" },
                        hostname: { type: "string" },
                        type: { type: "string" },
                        release: { type: "string" },
                        networkInterfaces: { type: "object" },
                    },
                    required: [
                        "node",
                        "platform",
                        "arch",
                        "cpus",
                        "memory",
                        "uptime",
                        "loadavg",
                        "totalmem",
                        "freemem",
                        "hostname",
                        "type",
                        "release",
                        "networkInterfaces",
                    ],
                },
            },
        },
    },
    required: ["ok", "data"],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const componentArr = [
    {
        type: "schema",
        name: "systemInfoReq",
        component: systemInfoReq,
    },
    {
        type: "schema",
        name: "systemInfoRes",
        component: systemInfoRes,
    },
];

export type systemInfoReqLike = FromSchema<typeof systemInfoReq>;
export type systemInfoResLike = FromSchema<typeof systemInfoRes>;
