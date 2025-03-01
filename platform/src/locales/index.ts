import { useLocaleStore } from "@/stores/locale";

const localeStore = useLocaleStore();
type keyofZhCN = keyof typeof import("./zh-CN").default;

export default function t(key: keyofZhCN) {
  const currentLang = localeStore.getLang();
  return (localeStore.langPackObj[currentLang] as { [key: string]: unknown })[
    key
  ] as string;
}
