import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
const modules = import.meta.glob("@/pages/**/index.vue");
const routes: Array<RouteRecordRaw> = [];
const _routes = [] as routesLike[];
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

function getRoutes() {
  for (const path in modules) {
    const routePath = path
      .replace("/src/pages", "")
      .replace("/index.vue", "")
      .toLowerCase();
    const pathArr = routePath.split("/");
    const level = pathArr.length - 1;
    const name = pathArr[pathArr.length - 1];
    const parent = pathArr
      .filter((o) => o !== "/")
      .slice(0, -1)
      .join("/");
    _routes.push({
      path: routePath || "/",
      name,
      level,
      parent,
      component: modules[path],
    });
  }
  //包含首页（取第一个）
  const firstRoute = { ..._routes[0] };
  firstRoute.path = "/";
  _routes.push(firstRoute);
}

function makeChildren(routerObj: routesLike, childrenArr: any[]) {
  if (!routerObj.parent) return false;
  const parent = childrenArr.find(
    (o: { path: any }) => o.path === routerObj.parent,
  );
  if (!parent) return false;
  if (!parent.children) parent.children = [];
  parent.children.push(routerObj);
  delete parent.component;
  return true;
}

function makeRouter() {
  getRoutes();
  for (const route of _routes) {
    const result = makeChildren(route, _routes);
    if (!result) routes.push(route);
  }
}
makeRouter();
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export { routes };

export default router;
