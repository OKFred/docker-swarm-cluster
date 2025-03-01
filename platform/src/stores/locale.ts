import { defineStore } from "pinia";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
type localeLike = "zh-CN" | "en-US";

async function i18nLoad(locale: localeLike) {
  const loadZhCN = async () =>
    await import("@/locales/zh-CN").then((res) => res.default);
  const loadEnUS = async () =>
    await import("@/locales/en-US").then((res) => res.default);
  const thisLangPack = locale === "zh-CN" ? await loadZhCN() : await loadEnUS();
  return thisLangPack;
}

export const useLocaleStore = defineStore("locale", {
  state: () => ({
    locale:
      ["zh-CN", "en-US"].find((s) => s === window.navigator.language) ||
      ("en-US" as localeLike),
    langPackObj: {
      "zh-CN": {} as { [key: string]: unknown },
      "en-US": {} as { [key: string]: unknown },
    },
    currentLangPackObj: {},
  }),
  actions: {
    async initLang(lang?: localeLike | string) {
      if (!lang) lang = this.locale;
      await i18nLoad(lang as localeLike).then((res) => {
        this.langPackObj[lang as localeLike] = res;
        this.currentLangPackObj = res;
      });
      dayjs.locale(lang === "zh-CN" ? "zh-cn" : "en");
    },
    async toggleLang() {
      this.locale = this.locale === "zh-CN" ? "en-US" : "zh-CN";
      await this.initLang(this.locale as localeLike);
    },
    getLang() {
      return this.locale as localeLike;
    },
  },
});
