import dotenv from "dotenv";
import { addCase, getCase, updateCase, deleteCase } from "./api/case/index.js";
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
        const detailsResponse = await getCase({ path: { id }, params: { caseToken: CASE_TOKEN } });
        const details = detailsResponse.data;
        console.log("Case details:", details);
        const { expectedTime, maxRetry, retryCount } = details;
        if (retryCount && maxRetry && !Number.isNaN(retryCount) && !Number.isNaN(maxRetry)) {
            if (retryCount >= maxRetry) {
                console.log("no more tries");
                return;
            }
        }
        let caseSucceed;
        if (details.caseTimeout && details.returnTime) {
            caseSucceed = details.caseTimeout > details.returnTime;
        }
        const callbackBody = {
            caseToken: details.caseToken || CASE_TOKEN,
            // 根据 caseTimeout 与 returnTime 判断 case 成功与否
            caseSucceed: caseSucceed || false,
            expectedTime: details.expectedTime || new Date().toISOString(),
        };
        const TimeDifference = expectedTime
            ? new Date().valueOf() - new Date(expectedTime).valueOf()
            : 0;
        if (TimeDifference > 0) {
            console.log("case timeout");
        } else {
            console.log("still running");
            await new Promise((resolve) => setTimeout(resolve, TimeDifference));
        }
        // 模拟等待 returnTime 后发起回调
        await new Promise((resolve) => setTimeout(resolve, details.returnTime));
        // 发起回调
        const callbackResult = await updateCase({
            path: { id },
            data: callbackBody,
        });
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
