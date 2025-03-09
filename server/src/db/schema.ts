import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { JSONSchema } from "json-schema-to-ts";

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

export const myCaseTable = sqliteTable("my_case", {
    id: integer("id").primaryKey().notNull(),
    caseName: text("case_name").notNull().unique(),
    caseToken: text("case_token").notNull(),
    caseTimeout: integer("case_timeout").notNull(),
    returnTime: integer("return_time").notNull(),
    caseSucceed: integer("case_succeed", { mode: "boolean" }).notNull().default(false),
    caseFinished: integer("case_finished", { mode: "boolean" }).notNull().default(false),
    createTime: text("create_time")
        .notNull()
        .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
    updateTime: text("update_time"),
    expectedTime: text("expected_time"),
    serviceId: text("service_id"),
    retryCount: integer("retry_count"),
    maxRetry: integer("max_retry").default(1),
});

export type myCaseLike = InferSelectModel<typeof myCaseTable>;
export type myCaseAddLike = InferInsertModel<typeof myCaseTable>;
