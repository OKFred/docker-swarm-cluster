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
    serviceOptions: Docker.ServiceSpec,
    terminateTimeout = 60_000,
) {
    let dockerServiceId: string;
    //如果服务存在，更新服务配置
    try {
        const service = await docker.createService(serviceOptions);
        dockerServiceId = service.id;
    } catch (err) {
        // console.error(`Error updating case service: ${err}`);
        if (!serviceOptions.Name) return;
        const service = await docker.getService(serviceOptions.Name);
        await service.update(serviceOptions);
        dockerServiceId = service.id;
    }
    setTimeout(() => {
        console.log("removeService");
        removeService(dockerServiceId);
    }, terminateTimeout);
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
