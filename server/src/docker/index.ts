import Docker from "dockerode";
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

export async function cleanDeadContainers(count?: number) {
    const containers = await docker.listContainers({ all: true });
    const containerPendingRemoval = [] as Docker.ContainerInfo[];
    containers.forEach(async (containerInfo) => {
        //且名称不包含case
        if (containerInfo.State === "exited") {
            containerPendingRemoval.push(containerInfo);
        }
    });
    let maxRemovalCount =
        count && count >= containerPendingRemoval.length ? count : containerPendingRemoval.length;
    for (let i = 0; i < maxRemovalCount; i++) {
        const container = containerPendingRemoval[i];
        try {
            await docker.getContainer(container.Id).remove({ force: true });
            console.log(`Removed container: ${container.Id}`);
        } catch (error) {
            console.error("Failed to remove container:", error);
        }
    }
}

export async function createOrUpdateService(
    caseId: number,
    caseToken: string,
    timeout = 60_000,
    replicas: number,
) {
    console.log({ replicas });
    const serviceOptions = {
        Name: `case-service-${caseId}`, // 根据任务ID生成服务名称
        TaskTemplate: {
            ContainerSpec: {
                Image: "registry.cn-hangzhou.aliyuncs.com/one-registry/docker-swarm-case", // 使用预先构建好的镜像
                Env: [
                    `SERVER_URL=http://10.121.118.11:3000`,
                    `CASE_ID=${caseId}`,
                    `CASE_TOKEN=${caseToken}`,
                ], // 环境变量
            },
            Resources: {
                Limits: { MemoryBytes: 1000000000 }, // 根据需要配置资源限制
            },
        },
        Mode: {
            ReplicatedJob: {
                MaxConcurrent: replicas,
                TotalCompletions: replicas,
            },
        },
        RestartPolicy: {
            Condition: "none", // 重启策略
        },
        Placement: {
            Constraints: ["node.labels.role == case"], // 限制容器在拥有 'case' 标签的节点上运行
        },
    };
    let dockerServiceId: string;
    //如果服务存在，更新服务配置
    try {
        const service = await docker.createService(serviceOptions);
        dockerServiceId = service.id;
    } catch (err) {
        // console.error(`Error updating case service: ${err}`);
        const service = await docker.getService(serviceOptions.Name);
        await service.update(serviceOptions);
        dockerServiceId = service.id;
    }
    setTimeout(() => {
        console.log("removeService", caseId);
        removeService(dockerServiceId);
    }, timeout);
    return dockerServiceId;
}

export async function removeService(dockerServiceId: string) {
    try {
        await docker.getService(dockerServiceId).remove();
        console.log(`Removed case service: ,`, dockerServiceId);
    } catch (err) {
        console.error(`Error removing case service: ${err}`);
    }
}
