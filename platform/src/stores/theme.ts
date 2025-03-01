import { defineStore } from "pinia";
type themeLike = "dark" | "light";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    //取浏览器默认主题，如果没有则默认light
    theme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : ("light" as themeLike),
  }),
  actions: {
    async toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
    },
    getTheme() {
      return this.theme as themeLike;
    },
  },
});
