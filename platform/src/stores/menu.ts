import { defineStore } from "pinia";
import type { routesLike } from "@/router";
import type { RouteRecordRaw } from "vue-router";

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menu: [] as RouteRecordRaw[],
    toolbar: {
      collapsed: false,
    },
  }),
  actions: {
    initMenu(routes: RouteRecordRaw[] | routesLike[]) {
      this.menu = routes.map((item) => {
        return {
          ...item,
          key: item.name,
          title: item.name,
          icon: "fas:question",
        };
      });
    },
    getMenu() {
      return this.menu;
    },
    setMenu(menu: RouteRecordRaw[]) {
      this.menu = menu;
    },
    toggleToolbar() {
      this.toolbar.collapsed = !this.toolbar.collapsed;
    },
    getToolbar() {
      return this.toolbar.collapsed;
    },
  },
});
