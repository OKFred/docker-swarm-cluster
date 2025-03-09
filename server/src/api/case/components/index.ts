import { App } from "@/types/app";
import { componentArr } from "../schema/index";

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
