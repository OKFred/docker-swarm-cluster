import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { myCaseTable } from "../db.model";
import type { myCaseAddLike } from "../db.model";
import { createOrUpdateService } from "@/docker/index";
import Dockerode from "dockerode";

process.env.SERVER_URL ??
    (console.error("env SERVER_URL is not set") !== void 0 || process.exit(1));

process.env.CASE_IMAGE_NAME ??
    (console.error("env CASE_IMAGE_NAME is not set") !== void 0 || process.exit(1));

export const addCase = async (bodyObj: any /* caseAddReqLike */) => {
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
};
