import { addCase, getCase, updateCase, deleteCase } from "./api/case/index.js";

async function initCase() {
    // 没有环境变量就随机生成
    const CASE_NAME = process.env.CASE_NAME || `case-${Math.floor(Math.random() * 10000)}`;
    const CASE_TOKEN = process.env.CASE_TOKEN || `token-${Math.floor(Math.random() * 10000)}`;
    try {
        // 构造新增 case 的数据，这里 caseTimeout 和 returnTime 为随机值
        const newCase = {
            caseName: CASE_NAME,
            caseToken: CASE_TOKEN,
            caseTimeout: Math.floor(Math.random() * 10000) + 10_000,
            returnTime: Math.floor(Math.random() * 10000) + 10_000, //加10s，留点时间给case容器生成
        };

        // 调用 server 添加 case 接口
        const response = await addCase({ data: newCase });
        const id = response.data;
        console.log("Created case with ID:", id);

        // 调用 get 接口获取 case 详情
        const detailsResponse = await getCase({ path: { id }, params: { caseToken: CASE_TOKEN } });
        // console.log("Case details:", detailsResponse.data);

        // 模拟等待 returnTime
        await new Promise((resolve) => setTimeout(resolve, detailsResponse.data.returnTime));
    } catch (err) {
        if (err instanceof Error === false) return;
        console.error("Error running case:", err.message);
    }
    updateTimeout();
}

let demoTimeout = 10_000;
function runLoop() {
    initCase().finally(() => setTimeout(runLoop, demoTimeout));
}

function updateTimeout() {
    demoTimeout = Math.floor(Math.random() * 3000);
    console.log("Running next case in ", Number(demoTimeout / 1000).toFixed(2), "s");
}

runLoop();
