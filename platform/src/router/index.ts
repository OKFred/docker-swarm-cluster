import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
const modules = import.meta.glob("@/pages/**/index.vue");
const routes: Array<RouteRecordRaw> = [];
export type routesLike = {
  path: string;
  name?: string;
  level?: number;
  parent?: string;
  key?: string;
  title?: string;
  icon?: string;
  component: () => Promise<unknown>;
};

const _routes = [] as routesLike[];
function getRoutes() {
  for (const path in modules) {
    const routePath = path
      .replace("/src", "")
      .replace("/pages", "")
      .replace("/index.vue", "")
      .toLowerCase();
    const routeName = routePath
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join("");
    const pathArr = routePath.split("/");
    const level = pathArr.length - 1;
    const parent = pathArr
      .filter((o) => o !== "/")
      .slice(0, -1)
      .join("/");
    _routes.push({
      path: routePath || "/",
      name: routeName || "Index",
      level,
      parent,
      component: modules[path],
    });
  }
}

function makeChildren(routerObj: routesLike, childrenArr: any[]) {
  if (!routerObj.parent) return false;
  const parent = childrenArr.find(
    (o: { path: any }) => o.path === routerObj.parent,
  );
  if (!parent) return false;
  if (!parent.children) parent.children = [];
  parent.children.push(routerObj);
  return true;
}

function makeRouter() {
  getRoutes();
  for (const route of _routes) {
    const result = makeChildren(route, _routes);
    if (!result) routes.push(route);
  }
  console.log({ routes });
}
makeRouter();

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export { routes };

export default router;
