import Docker from "dockerode";
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

export async function cleanDeadContainers() {
    const containers = await docker.listContainers({ all: true });
    containers.forEach(async (containerInfo) => {
        const container = await docker.getContainer(containerInfo.Id);
        const inspect = await container.inspect();
        //且名称不包含case
        if (inspect.State.Status === "exited" && !containerInfo.Names[0].includes("case")) {
            console.log(`Removing dead container ${containerInfo.Id}`);
            await container.remove();
        }
    });
}

export async function cleanDeadServices() {
    const services = await docker.listServices();
    services.forEach(async (serviceInfo) => {
        const service = await docker.getService(serviceInfo.ID);
        const inspect = await service.inspect();
        //如果Tasks都是complete状态，那么删除服务
        if (
            inspect.Spec.Mode.Replicated.Replicas ===
            inspect.Spec.TaskTemplate.ContainerSpec.Env.length
        ) {
            console.log(`Removing dead service ${serviceInfo.ID}`);
            await service.remove();
        }
    });
}

export async function createService(caseId: number, caseToken: string) {
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
            Replicated: {
                Replicas: 1, // 根据需要设置副本数
            },
        },
        Placement: {
            Constraints: ["node.labels.role == case"], // 限制容器在拥有 'case' 标签的节点上运行
        },
    };
    docker
        .createService(serviceOptions)
        .then((service) => console.log(`Created case service: ${service.id}`))
        .catch((err) => console.error(`Error creating case service: ${err}`));
}
