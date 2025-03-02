<template>
  <a-config-provider :locale="settings.locale === 'zh-CN' ? zhCN : enUS">
    <Suspense fallback="{null}">
      <Transition name="fade-transform" mode="out-in">
        <div>
          <div v-show="settings.loading" class="my-center-all my-full-screen">
            <img :src="loadingImg" alt="loading" />
          </div>
          <div v-show="!settings.loading">
            <Layout />
          </div>
        </div>
      </Transition>
    </Suspense>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { useLocaleStore, type localeLike } from "@/stores/locale";
import { useThemeStore } from "@/stores/theme";
import { useLoadingStore } from "@/stores/loading";
import { useMenuStore } from "@/stores/menu";

import Layout from "./layout/index.vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import loadingImg from "/loading.svg";
import { routes } from "./router";

const localeStore = useLocaleStore();
const themeStore = useThemeStore();
const loadingStore = useLoadingStore();
const menuStore = useMenuStore();

const settings = reactive({
  locale: localeStore.getLang(),
  theme: themeStore.getTheme() === "dark" ? "dark" : "light",
  loading: loadingStore.getLoading(),
  menu: menuStore.getMenu(),
});

watch(
  () => loadingStore.$state.loading,
  (val) => {
    settings.loading = val;
  },
  {
    immediate: true,
  },
);

watch(
  () => routes,
  (val) => {
    menuStore.initMenu(val);
    settings.menu = menuStore.getMenu();
  },
  {
    immediate: true,
  },
);

watch(
  () => localeStore.$state.locale,
  (val) => {
    settings.locale = val as localeLike;
  },
);
</script>

<style scoped lang="scss">
.my-full-screen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
