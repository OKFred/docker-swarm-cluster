import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
dotenv.config();
export default defineConfig({
    out: "./db/sql",
    schema: "./db/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
        url: process.env.DB_FILE_NAME,
    },
});
