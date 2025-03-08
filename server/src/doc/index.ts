import fs from "fs";
import path from "path";
import { App } from "@/types/app";

function main(app: App) {
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
    app.doc31("/doc.json", {
        openapi: "3.1.0",
        info: {
            version: "1.0.0",
            title: "My API",
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    });
    app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });
}

export default main;
