import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "../db.model";
import type { myCaseLike } from "../db.model";
import { caseGetReqLike } from "../api.schema";

const service = async (id: myCaseLike["id"], paramObj: caseGetReqLike) => {
    const rows = await db
        .select()
        .from(myCaseTable)
        .where(
            and(
                eq(myCaseTable.id, id),
                eq(myCaseTable.caseToken, paramObj.caseToken),
                paramObj.caseName ? eq(myCaseTable.caseName, paramObj.caseName) : undefined,
            ),
        )
        .limit(1);
    return rows[0];
};

export default service;
