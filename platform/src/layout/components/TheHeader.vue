<template>
  <div
    :class="`the-header ${TheHeader.data.theme === 'dark' ? 'the-header-dark' : ''}`"
  >
    <div class="my-far-table">
      <div class="my-center-all">
        <span class="my-default-padding" @click="toggleToolbar()">
          <Icon name="fab:github" :faObj="{ size: '2x' }" />
        </span>
        <h1>{{ TheHeader.data.title }}</h1>
      </div>
      <div class="the-user">
        <div class="my-center-all my-default-padding">
          <a-dropdown>
            <a>
              <a-avatar class="the-avatar">U</a-avatar>
              USER
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="onChangeLanguage" class="my-center-all">
                    <Icon name="fas:language" :faObj="{ size: '2x' }" />
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="onChangeTheme" class="my-center-all">
                    <Icon
                      name="fas:sun"
                      :faObj="{ size: '2x' }"
                      v-show="TheHeader.data.theme === 'dark'"
                    />
                    <Icon
                      name="fas:moon"
                      :faObj="{ size: '2x' }"
                      v-show="TheHeader.data.theme === 'light'"
                    />
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from "@/components/Icon/index.vue";
import { useLocaleStore } from "@/stores/locale";
import { useMenuStore } from "@/stores/menu";
import { useThemeStore } from "@/stores/theme";
import { reactive, watch } from "vue";
const themeStore = useThemeStore();
const localeStore = useLocaleStore();
const menuStore = useMenuStore();

const TheHeader = reactive({
  data: {
    title: "common.dashboard",
    theme: themeStore.getTheme(),
  },
});

function toggleToolbar() {
  menuStore.toggleToolbar();
}
function onChangeLanguage() {
  localeStore.toggleLang();
}
function onChangeTheme() {
  themeStore.toggleTheme();
}

watch(
  () => themeStore.getTheme(),
  (theme) => {
    TheHeader.data.theme = theme;
  },
);

watch(
  () => localeStore.getLang(),
  async () => {
    const t = (await import("@/locales/index")).default;
    TheHeader.data.title = t("common.dashboard");
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.the-header {
  z-index: 1;
  width: 100%;
  height: 88px;
  background-color: rgba(255, 255, 255, 0.6);
  position: fixed;
  top: 0;
  left: 0;
}
.the-header-dark {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
}
.the-avatar {
  color: #f56a00;
  background-color: #fde3cf;
  cursor: pointer;
}
.the-user {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
