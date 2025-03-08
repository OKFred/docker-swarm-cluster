import { App } from "@/types/app";
import { caseAddReq, caseAddRes } from "../schema";

const componentArr = [
    {
        type: "schema",
        name: "caseAddReq",
        component: caseAddReq,
    },
    {
        type: "schema",
        name: "caseAddRes",
        component: caseAddRes,
    },
];
function main(app: App) {
    componentArr.forEach((component) => {
        app.openAPIRegistry.registerComponent(
            "schemas",
            component.name,
            component.component as any,
        );
    });
}
export default main;
