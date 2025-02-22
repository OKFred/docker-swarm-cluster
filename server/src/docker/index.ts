import Docker from "dockerode";
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

async function scaleService(serviceName: string, replicas: number) {
    // const service = await docker.getService(serviceName);
    // const serviceInfo = await service.inspect();
    // serviceInfo.Spec.Mode.Replicated.Replicas = replicas;
    // await service.update({ version: serviceInfo.Version.Index, Spec: serviceInfo.Spec });
    console.log(docker);
}

scaleService("my-stack_airbot-case", 10);
