import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const dbFile = process.env.DB_FILE_NAME || ":memory:";
const client = createClient({ url: dbFile });
const db = drizzle({ client });

async function tableInit() {
    await db.run(`
        CREATE TABLE IF NOT EXISTS my_case (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_name TEXT NOT NULL UNIQUE,
            case_token TEXT NOT NULL,
            case_timeout INTEGER NOT NULL,
            return_time INTEGER NOT NULL,
            case_succeed BOOLEAN NOT NULL DEFAULT 0,
            case_finished BOOLEAN NOT NULL DEFAULT 0,
            create_time TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
            update_time TEXT,
            expected_time TEXT,
            service_id TEXT,
            retry_count INTEGER,
            max_retry INTEGER DEFAULT 1
        )
    `);
    console.log("Table initialized");
}
tableInit();

export { db };
export default db;
