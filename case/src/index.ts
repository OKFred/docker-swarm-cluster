import dotenv from "dotenv";
import { addCase, getCase, updateCase, deleteCase } from "./api/index.js";
dotenv.config();

// 没有环境变量就随机生成
const CASE_NAME = process.env.CASE_NAME || `case-${Math.floor(Math.random() * 10000)}`;
const CASE_TOKEN = process.env.CASE_TOKEN || `token-${Math.floor(Math.random() * 10000)}`;

async function runCase() {
    try {
        // 构造新增 case 的数据，这里 caseTimeout 和 returnTime 为随机值
        const newCase = {
            caseName: CASE_NAME,
            caseToken: CASE_TOKEN,
            caseTimeout: Math.floor(Math.random() * 10000),
            returnTime: Math.floor(Math.random() * 10000),
        };

        // 调用 server 添加 case 接口
        const id = await addCase(newCase);
        console.log("Created case with ID:", id);

        // 调用 run 接口获取 case 详情
        const details = await getCase(id);
        console.log("Case details:", details);

        // 模拟等待 returnTime 后发起回调
        await new Promise((resolve) => setTimeout(resolve, details.returnTime));

        const callbackBody = {
            caseName: details.caseName,
            caseToken: details.caseToken,
            // 根据 caseTimeout 与 returnTime 判断 case 成功与否
            caseSucceed: details.caseTimeout > details.returnTime,
        };

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
