import { defineStore } from "pinia";
type loadingLike = true | false;

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    //取浏览器默认主题，如果没有则默认light
    loading: true as loadingLike,
  }),
  actions: {
    async setLoading(status: loadingLike) {
      this.loading = status;
    },
    getLoading() {
      return this.loading as loadingLike;
    },
  },
});
