import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import type { myCaseLike } from "@/db/schema";
import Dockerode from "dockerode";
type casePropLike =
    | keyof myCaseLike
    | keyof {
          serviceOptions: Dockerode.ServiceSpec;
          terminateTimeout: number;
      };
export const caseAddReq = {
    type: "object",
    properties: {
        caseName: { type: "string" },
        caseToken: { type: "string" },
        caseTimeout: { type: "number" },
        returnTime: { type: "number" },
        serviceOptions: {
            type: "object",
            properties: {
                Name: { type: "string" },
                Labels: { type: "object" },
                TaskTemplate: { type: "object" },
                Mode: { type: "object" },
                UpdateConfig: { type: "object" },
                RollbackConfig: { type: "object" },
                Networks: { type: "array" },
                EndpointSpec: { type: "object" },
            },
        },
        terminateTimeout: { type: "number" },
    } satisfies Partial<Record<casePropLike, JSONSchema>>,
    required: ["caseName", "caseToken", "caseTimeout", "returnTime"],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const caseAddRes = {
    type: "object",
    properties: {
        ok: { type: "boolean" },
        message: { type: "string" },
        data: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    required: ["ok"],
    additionalProperties: false,
} as const satisfies JSONSchema;

export type caseAddReqLike = FromSchema<typeof caseAddReq>;
export type caseAddResLike = FromSchema<typeof caseAddRes>;
