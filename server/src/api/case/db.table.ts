import db from "@/db/index";
import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import Dockerode from "dockerode";

export const caseIndex = {
    id: {
        type: "number",
        description: "id",
        examples: [1],
    },
} as const satisfies Partial<Record<keyof myCaseLike, JSONSchema>>;

export const myCase = {
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
    createTimeUtc: {
        type: "string",
    },
    updateTimeUtc: {
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
} as const satisfies Partial<Record<keyof myCaseLike, JSONSchema>>;

export const serviceOptions = {
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
    } satisfies Partial<Record<keyof Dockerode.ServiceSpec, JSONSchema>>,
} as const satisfies JSONSchema;

export const mailAccountTimestamp = {
    createTimeUtc: {
        type: "number",
        description: "创建时间",
        examples: [1672531199000],
    },
    updateTimeUtc: {
        type: "number",
        nullable: true,
        description: "更新时间",
        examples: [1672531199000],
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
    expectedTime: text("expected_time"),
    serviceId: text("service_id"),
    retryCount: integer("retry_count"),
    maxRetry: integer("max_retry").default(1),
    createTimeUtc: integer("create_time_utc")
        .notNull()
        .default(
            sql`(CAST(strftime('%s', 'now') AS INTEGER) * 1000 + CAST(substr(strftime('%f', 'now'), 4, 3) AS INTEGER))`,
        ),
    updateTimeUtc: integer("update_time_utc"),
});
export type myCaseLike = InferSelectModel<typeof myCaseTable>;
export type myCaseAddLike = InferInsertModel<typeof myCaseTable> &
    FromSchema<typeof serviceOptions>;

export async function tableInit() {
    await db.run(`
        CREATE TABLE IF NOT EXISTS my_case (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_name TEXT NOT NULL UNIQUE,
            case_token TEXT NOT NULL,
            case_timeout INTEGER NOT NULL,
            return_time INTEGER NOT NULL,
            case_succeed BOOLEAN NOT NULL DEFAULT 0,
            case_finished BOOLEAN NOT NULL DEFAULT 0,
            expected_time TEXT,
            service_id TEXT,
            retry_count INTEGER,
            max_retry INTEGER DEFAULT 1,
            create_time_utc INTEGER DEFAULT (
              CAST(strftime('%s', 'now') AS INTEGER) * 1000 +
              CAST(substr(strftime('%f', 'now'), 4, 3) AS INTEGER)
            ),
            update_time_utc INTEGER
        )
    `);
    console.log("Table initialized");
}

export default myCaseTable;
