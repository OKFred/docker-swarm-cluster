import { and, eq } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable, type myCaseLike } from "../db.model";
import { caseDeleteReqLike } from "../api.schema";

const service = async (id: myCaseLike["id"], bodyObj: caseDeleteReqLike) => {
    await db
        .delete(myCaseTable)
        .where(and(eq(myCaseTable.id, id), eq(myCaseTable.caseToken, bodyObj.caseToken)));
    return id;
};

export default service;
