import { JSONSchema } from "json-schema-to-ts";
import type { myCaseLike, myCaseAddLike } from "./db.model";

export const myCase = {
    id: {
        type: "number",
    },
    caseName: {
        type: "string",
    },
    caseToken: {
        type: "string",
    },
    caseTimeout: {
        type: "number",
    },
    returnTime: {
        type: "number",
    },
    caseSucceed: {
        type: "boolean",
    },
    caseFinished: {
        type: "boolean",
    },
    createTime: {
        type: "string",
    },
    updateTime: {
        type: "string",
        nullable: true,
    },
    expectedTime: {
        type: "string",
        nullable: true,
    },
    serviceId: {
        type: "string",
        nullable: true,
    },
    retryCount: {
        type: "number",
        nullable: true,
    },
    maxRetry: {
        type: "number",
        nullable: true,
    },
} as const satisfies Record<keyof myCaseLike, JSONSchema>;

export const myCaseAddable = {
    caseName: {
        type: "string",
    },
    caseToken: {
        type: "string",
    },
    caseTimeout: {
        type: "number",
    },
    returnTime: {
        type: "number",
    },
} as const satisfies Partial<Record<keyof myCaseAddLike, JSONSchema>>;

export const myCaseReadable = {
    caseName: {
        type: "string",
    },
    caseToken: {
        type: "string",
    },
} as const satisfies Partial<Record<keyof myCaseLike, JSONSchema>>;

export const myCaseUpdatable = {
    expectedTime: {
        type: "string",
    },
    caseToken: {
        type: "string",
    },
    caseSucceed: {
        type: "boolean",
    },
} as const satisfies Partial<Record<keyof myCaseLike, JSONSchema>>;

export const myCaseDeletable = {
    caseToken: {
        type: "string",
    },
} as const satisfies Partial<Record<keyof myCaseLike, JSONSchema>>;
