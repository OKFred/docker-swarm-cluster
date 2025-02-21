import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
dotenv.config();
export default defineConfig({
    out: "./src/db/sql",
    schema: "./src/db/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
        url: process.env.DB_FILE_NAME,
    },
});
