<template>
  <a-config-provider :locale="settings.locale === 'zh-CN' ? zhCN : enUS">
    <Suspense fallback="{null}">
      <Layout />
    </Suspense>
  </a-config-provider>
</template>

<script setup lang="ts">
import Layout from "./layout/index.vue";
import { useLocaleStore } from "./stores/locale";
import { useThemeStore } from "./stores/theme";
import { reactive } from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";

const localeStore = useLocaleStore();
const themeStore = useThemeStore();

const settings = reactive({
  locale: localeStore.getLang(),
  theme: themeStore.getTheme() === "dark" ? "dark" : "light",
});
</script>

<style scoped lang="scss"></style>
