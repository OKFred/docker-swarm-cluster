import { and, eq, asc, desc } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "@/db/schema";
import { NodeHonoContext, RawRouteConfig } from "@/types/app";
import { validate } from "@cfworker/json-schema";
import { caseListReq, caseListReqLike, caseListResLike } from "./index";
import { errorSchema } from "@/middleware/errorHandler/schema";
import { HTTPException } from "hono/http-exception";

const pathObj = {
    path: "/list",
    method: "post",
    description: "查询 case列表",
    summary: "查询 case列表",
    tags: ["case"],
    parameters: [],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/caseListReq",
                },
            },
        },
    },
    responses: {
        200: {
            description: "成功",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/caseListRes",
                    },
                },
            },
        },
        422: errorSchema[422],
    },
} satisfies RawRouteConfig;

const controller = async (c: NodeHonoContext) => {
    const bodyObj = (await c.req.json()) satisfies caseListReqLike;
    const { valid, errors } = validate(bodyObj, caseListReq as object, "2020-12");
    if (!valid) throw new HTTPException(422, { cause: errors });
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
    return c.json(
        {
            ok: true,
            data: {
                list: rows,
                total,
                totalPage,
                pageNo,
                pageSize: finalPageSize,
            },
        } satisfies caseListResLike,
        200,
    );
};
export default { pathObj, controller };
