import { defineStore } from "pinia";
import type { routesLike } from "@/router";

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menu: [] as routesLike[],
  }),
  actions: {
    initMenu(routes: routesLike[]) {
      this.menu = routes.map((item) => {
        return {
          path: item.path,
          name: item.name,
          level: item.level,
          parent: item.parent,
          key: item.name,
          title: item.name,
          icon: "fas:question",
          component: item.component,
        };
      });
    },
    getMenu() {
      return this.menu;
    },
    setMenu(menu: routesLike[]) {
      this.menu = menu;
    },
  },
});
