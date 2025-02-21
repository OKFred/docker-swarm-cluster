import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
export const myCaseTable = sqliteTable("my_case", {
    id: integer("id").primaryKey().notNull(),
    caseName: text("case_name").notNull().unique(),
    caseToken: text("case_token").notNull(),
    caseTimeout: integer("case_timeout").notNull(),
    returnTime: integer("return_time").notNull(),
    caseSucceed: integer("case_succeed", { mode: "boolean" }).notNull().default(false),
    caseFinished: integer("case_finished", { mode: "boolean" }).notNull().default(false),
    timeCreated: text("time_created").default(sql `(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
    timeUpdated: text("time_updated"),
});
