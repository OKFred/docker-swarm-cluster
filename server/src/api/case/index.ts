import { App } from "@/types/app";
import addCase from "./components/add";
import getCase from "./components/get";
import listCase from "./components/list";
import updateCase from "./components/update";
import deleteCase from "./components/delete";

function main(app: App) {
    addCase(app);
    getCase(app);
    listCase(app);
    updateCase(app);
    deleteCase(app);
}

export default main;
