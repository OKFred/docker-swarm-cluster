import dotenv from "dotenv";
dotenv.config();
//调用飞书webhook，系统事件上报

// 发送文本消息
const feishuconfig = {
    webhook: process.env.FEISHU_WEBHOOK,
};
feishuconfig.webhook ??
    (console.error("env FEISHU_WEBHOOK is not set") !== void 0 || process.exit(1));

export async function sendFeishuMessage(text: unknown) {
    if (!feishuconfig.webhook) {
        return;
    }
    const res = await fetch(feishuconfig.webhook, {
        method: "post",
        body: JSON.stringify({
            msg_type: "text",
            content: {
                text,
            },
        }),
    });
    return res;
}
