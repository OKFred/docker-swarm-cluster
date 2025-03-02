<template>
  <ContentWrapper
    :class="TheContent.data.collapsed ? 'the-max-width' : 'the-collapsed-width'"
  >
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </ContentWrapper>
</template>

<script lang="ts" setup>
import ContentWrapper from "@/components/contentWrapper/index.vue";
import { useMenuStore } from "@/stores/menu";
import { useThemeStore } from "@/stores/theme";
import { reactive, watch } from "vue";
const themeStore = useThemeStore();
const menuStore = useMenuStore();

const TheContent = reactive({
  data: {
    theme: themeStore.getTheme(),
    collapsed: menuStore.getToolbar(),
  },
});

watch(
  () => themeStore.getTheme(),
  (theme) => {
    TheContent.data.theme = theme;
  },
);

watch(
  () => menuStore.getToolbar(),
  (collapsed) => {
    TheContent.data.collapsed = collapsed;
  },
);
</script>

<style scoped lang="scss">
.the-max-width {
  margin-top: calc(88px + 24px);
  margin-left: 0;
  width: calc(100% - 0px);
}
.the-collapsed-width {
  margin-top: calc(88px + 24px);
  margin-left: 256px;
  width: calc(100% - 256px);
}
</style>
