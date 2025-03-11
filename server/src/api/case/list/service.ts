import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "../db.model";
import { caseListReqLike } from "../components/index";

const service = async (bodyObj: caseListReqLike) => {
    const { orderBy = "id", descend = true, pageNo = 1, pageSize = 10, keyword = "" } = bodyObj;
    const offset = (pageNo - 1) * pageSize;
    const orderField = myCaseTable[orderBy] || myCaseTable.id;
    const maxPageSize = 1000;
    const finalPageSize = pageSize > maxPageSize ? maxPageSize : pageSize;
    const queryDB = (getAll?: boolean) =>
        db
            .select()
            .from(myCaseTable)
            .where(keyword ? eq(myCaseTable.caseName, keyword) : undefined)
            .orderBy(!descend ? asc(orderField) : desc(orderField))
            .limit(getAll ? maxPageSize : finalPageSize)
            .offset(getAll ? 0 : offset);
    const allRows = await queryDB(true);
    const rows = allRows.slice(offset, offset + finalPageSize);
    const total = allRows.length;
    const totalPage = Math.ceil(total / finalPageSize);
    return {
        list: rows,
        total,
        totalPage,
        pageNo,
        pageSize: finalPageSize,
    };
};

export default service;
