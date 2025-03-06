import type { App } from "@/types/app.ts";
import { sendFeishuMessage } from "@/rpc/feishu/instance";
export default function corsHandler(app: App) {
    app.onError((e, c) => {
        console.error(e);
        return c.json({ ok: false, message: e.message });
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
