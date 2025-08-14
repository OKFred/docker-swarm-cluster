import db from "@/db/index";
import { myCaseAddLike, myCaseTable } from "./db.table";
import { asc, count, desc, eq, or } from "drizzle-orm";
import type { caseAddReqLike, caseAddResLike } from "./add";
import Dockerode from "dockerode";
import { createOrUpdateService } from "@/docker";
// import type { myCaseDeleteReqLike, myCaseDeleteResLike } from "./delete";
// import type { myCaseGetReqLike, myCaseGetResLike } from "./get";
// import type { myCaseListReqLike, myCaseListResLike } from "./list";
// import type { myCaseUpdateReqLike, myCaseUpdateResLike } from "./update";

const myCaseService = {
    async add(bodyObj: caseAddReqLike) {
    let { caseName, caseToken, caseTimeout, returnTime, serviceOptions } = bodyObj;
    const expectedTime = new Date(new Date().valueOf() + caseTimeout).toISOString();
    const resultAdd = await db
        .insert(myCaseTable)
        .values({
            caseName,
            caseToken,
            caseTimeout,
            returnTime,
            expectedTime,
        } satisfies myCaseAddLike)
        .run();
    const id = Number(resultAdd.lastInsertRowid);
    if (!serviceOptions) {
        serviceOptions = {
            Name: `case-service-${id}`,
            TaskTemplate: {
                ContainerSpec: {
                    Image: process.env.CASE_IMAGE_NAME,
                    Env: [
                        `SERVER_URL=${process.env.SERVER_URL}`,
                        `CASE_ID=${id}`,
                        `CASE_TOKEN=${caseToken}`,
                    ],
                },
                RestartPolicy: {
                    Condition: "on-failure",
                },
                Resources: {
                    Limits: { MemoryBytes: 1000000000 },
                },
                Placement: {
                    Constraints: ["node.labels.role == case"],
                },
            },
            Mode: {
                Replicated: {
                    Replicas: 1,
                },
            },
        } satisfies Dockerode.ServiceSpec;
    }
    const terminateTimeout = caseTimeout + 60_000;
    const serviceId = await createOrUpdateService(serviceOptions, terminateTimeout);
    await db.update(myCaseTable).set({ serviceId }).where(eq(myCaseTable.id, id));
    return id;
    },
};

export default myCaseService;
