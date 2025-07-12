import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const myCaseTable = sqliteTable("my_case", {
    id: integer("id").primaryKey().notNull(),
    caseName: text("case_name").notNull().unique(),
    caseToken: text("case_token").notNull(),
    caseTimeout: integer("case_timeout").notNull(),
    returnTime: integer("return_time").notNull(),
    caseSucceed: integer("case_succeed", { mode: "boolean" }).notNull().default(false),
    caseFinished: integer("case_finished", { mode: "boolean" }).notNull().default(false),
    createTimeUtc: text("create_time")
        .notNull()
        .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
    updateTimeUtc: text("update_time"),
    expectedTime: text("expected_time"),
    serviceId: text("service_id"),
    retryCount: integer("retry_count"),
    maxRetry: integer("max_retry").default(1),
});
export type myCaseLike = InferSelectModel<typeof myCaseTable>;
export type myCaseAddLike = InferInsertModel<typeof myCaseTable>;
