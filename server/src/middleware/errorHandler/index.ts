import type { App } from "@/types/app.ts";
import { sendFeishuMessage } from "@/rpc/feishu/instance";
import { HTTPException } from "hono/http-exception";

type HTTPExceptionConstructorParams = Required<ConstructorParameters<typeof HTTPException>>;
type HTTPExceptionOptions = Required<HTTPExceptionConstructorParams[1]>; // 提取第二个参数的类型

export default function errorHandler(app: App) {
    app.notFound((c) => {
        return c.json({ ok: false, message: "Not Found", errors: [] }, { status: 404 });
    });

    app.openAPIRegistry.registerComponent("schemas", "ErrorInvalidRequest", {
        type: "object",
        properties: {
            ok: { type: "boolean" },
            message: { type: "string" },
            errors: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        instanceLocation: { type: "string" },
                        keyword: { type: "string" },
                        keywordLocation: { type: "string" },
                        error: { type: "string" },
                    },
                },
            },
        },
        required: ["ok", "message"],
    });

    app.onError((e, c) => {
        console.error(e);
        if (e instanceof HTTPException) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    message: "请求体校验失败",
                    errors: e.cause as HTTPExceptionOptions["cause"],
                }),
                { status: 422 },
            );
        }
        return c.json(
            {
                ok: false,
                message: "未知异常",
                errors: process.env.NODE_ENV !== "production" && e.message,
            },
            { status: 500 },
        );
    });
}

/**
 * @description: 未捕获异常处理事件上报
 */
process.on("uncaughtException", function (err) {
    console.error("uncaughtException:", err);
    sendFeishuMessage("uncaughtException:" + err);
});

process.env.NODE_ENV === "production" &&
    sendFeishuMessage("服务器已启动").then(async (res) => {
        const result = await res?.json();
        console.log(result);
    });
