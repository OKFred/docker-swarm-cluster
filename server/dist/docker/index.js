import Docker from "dockerode";
const docker = new Docker({ socketPath: "/var/run/docker.sock" });
async function scaleService(serviceName, replicas) {
    // const service = await docker.getService(serviceName);
    // const serviceInfo = await service.inspect();
    // serviceInfo.Spec.Mode.Replicated.Replicas = replicas;
    // await service.update({ version: serviceInfo.Version.Index, Spec: serviceInfo.Spec });
    console.log(docker);
}
async function getAllContainers() {
    const containers = await docker.listContainers();
    console.log(containers);
}
getAllContainers();
// scaleService("my-stack_airbot-case", 10);
