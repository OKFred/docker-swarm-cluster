import fs from "fs";
import path from "path";
import os from "os";
import { App } from "@/types/app";

function main(app: App) {
    // 返回 OpenAPI 文档 doc.json
    app.get("/doc.json", async (c) => {
        const docPath = path.join(process.cwd(), "src", "doc", "index.json");
        try {
            const docContent = fs.readFileSync(docPath, "utf-8");
            return c.body(docContent, 200, { "Content-Type": "application/json" });
        } catch (e) {
            return c.json({ ok: false, message: "Failed to read doc.json" });
        }
    });

    // 返回 Swagger UI 页面
    app.get("/doc", async (c) => {
        const docHtmlPath = path.join(process.cwd(), "src", "doc", "index.html");
        try {
            const htmlContent = fs.readFileSync(docHtmlPath, "utf-8");
            return c.body(htmlContent, 200, { "Content-Type": "text/html" });
        } catch (e) {
            return c.json({ ok: false, message: "Failed to read doc/index.html" });
        }
    });
}

export default main;
