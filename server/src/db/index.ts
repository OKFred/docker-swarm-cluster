import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { myCaseTable } from "../api/case/db.model";

const dbFile = process.env.DB_FILE_NAME || ":memory:";
const client = createClient({ url: dbFile });
const db = drizzle<{ my_case: typeof myCaseTable }>({ client }); 

export { db };
export default db;
