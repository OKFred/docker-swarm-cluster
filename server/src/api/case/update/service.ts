import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "../db.model";
import type { myCaseLike } from "../db.model";
import { caseUpdateReqLike } from "../api.schema";

const service = async (id: myCaseLike["id"], bodyObj: caseUpdateReqLike) => {
    const { expectedTime, caseToken, caseSucceed } = bodyObj;
    const updateTime = new Date().toISOString();
    const rows = await db.select().from(myCaseTable).where(eq(myCaseTable.id, id)).limit(1);
    if (rows.length === 0) return false;
    const { serviceId, maxRetry, retryCount } = rows[0];
    const newRetryCount = retryCount ? retryCount + 1 : 1;
    if (maxRetry && newRetryCount > maxRetry) {
        console.log("max retry count reached");
        return false;
    }
    const TimeDifference = new Date().valueOf() - new Date(expectedTime).valueOf();
    if (TimeDifference < 0) {
        console.log("still running");
        return false;
    }
    const res = await db
        .update(myCaseTable)
        .set({ caseSucceed, caseFinished: true, updateTime, retryCount: newRetryCount })
        .where(and(eq(myCaseTable.id, id), eq(myCaseTable.caseToken, caseToken)));
    if (res.rowsAffected === 0) return false;
    /* setTimeout(async () => {
            console.log("超时，准备清理容器");
            // serviceId && removeService(serviceId);
        }, 20_000); */
    return id;
};

export default service;
