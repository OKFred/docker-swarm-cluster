import dotenv from "dotenv";
import { addCase, getCase, updateCase, deleteCase } from "./api/index.js";
dotenv.config();

async function runCase() {
    // 没有环境变量就随机生成
    const CASE_ID = process.env.CASE_ID;
    const CASE_TOKEN = process.env.CASE_TOKEN || `token-${Math.floor(Math.random() * 10000)}`;
    if (!CASE_ID) {
        console.error("CASE_ID is not set");
        process.exit(1);
    }
    const id = Number(CASE_ID);
    try {
        // 调用 get 接口获取 case 详情
        const details = await getCase(id);
        console.log("Case details:", details);
        const { expectedTime, maxRetry, tryCount } = details;
        if (tryCount >= maxRetry) {
            console.log("no more tries");
            return;
        }

        const callbackBody = {
            caseToken: details.caseToken,
            // 根据 caseTimeout 与 returnTime 判断 case 成功与否
            caseSucceed: details.caseTimeout > details.returnTime,
            expectedTime,
        };
        const TimeDifference = new Date().valueOf() - expectedTime;
        if (TimeDifference > 0) {
            console.log("case timeout");
            callbackBody.expectedTime = null;
        } else {
            console.log("still running");
            await new Promise((resolve) => setTimeout(resolve, TimeDifference));
        }
        // 模拟等待 returnTime 后发起回调
        await new Promise((resolve) => setTimeout(resolve, details.returnTime));
        // 发起回调
        const callbackResult = await updateCase(id, callbackBody);
        console.log("Callback response:", callbackResult);

        // 调用删除 case 接口（如有需要）
        // const deletionResult = await deleteCase(id);
        // console.log("Case deletion:", deletionResult);
    } catch (err) {
        if (err instanceof Error === false) return;
        console.error("Error running case:", err.message);
    }
}
runCase();
