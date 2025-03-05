<template>
  <div class="the-menu-wrapper">
    <a-menu
      v-show="!TheMenu.data.menuShow"
      :class="`the-menu ${TheMenu.data.collapsed ? 'the-menu-clapsed' : ''}`"
      v-model:openKeys="TheMenu.data.openKeys"
      v-model:selectedKeys="TheMenu.data.selectedKeys"
      :mode="TheMenu.data.mode"
      :items="TheMenu.data.menuItems"
      :theme="TheMenu.data.theme"
      @select="onSelect"
    >
    </a-menu>
  </div>
</template>

<script lang="ts" setup>
import { h, reactive, watch, onMounted } from "vue";
import type { MenuMode, MenuTheme } from "ant-design-vue";
import type { ItemType } from "ant-design-vue";
import { useMenuStore } from "@/stores/menu";
import { useThemeStore } from "@/stores/theme";
import router, { routes } from "@/router";
import Icon from "@/components/Icon/index.vue";
const metaModules = import.meta.glob("@/pages/**/meta.ts");
const themeStore = useThemeStore();
const menuStore = useMenuStore();
const TheMenu = reactive({
  data: {
    mode: "inline" as MenuMode,
    theme: themeStore.getTheme() as MenuTheme,
    selectedKeys: [],
    openKeys: [],
    menuItems: [] as ItemType[],
    collapsed: false,
    menuShow: false,
  },
  fn: {
    onSelect,
  },
});
watch(
  () => themeStore.getTheme(),
  (theme) => {
    TheMenu.data.theme = theme as MenuTheme;
  },
);
watch(
  () => menuStore.getToolbar(),
  (collapsed) => {
    TheMenu.data.collapsed = collapsed;
    const timeout = collapsed ? 200 : 0;
    setTimeout(() => {
      TheMenu.data.menuShow = collapsed;
    }, timeout);
  },
);

async function getMetas() {
  const metaArr: any[] = [];
  for (const metaModule in metaModules) {
    const meta = await metaModules[metaModule]().then(
      (res: any) => res.default,
    );
    const path = metaModule.replace("/src/pages", "").replace("/meta.ts", "");
    metaArr.push({ path, meta: { ...meta } });
  }
  return metaArr;
}

async function generateMenuItems(routes: any[]) {
  const items: ItemType[] = [];
  const metaArr = await getMetas();
  for (const route of routes) {
    if (route.path === '/') continue;
    const children = route.children
      ? await generateMenuItems(route.children)
      : undefined;
    const metaObj = metaArr.find((item) => item.path === route.path);
    const meta = metaObj?.meta;
    let icon = meta?.icon;
    const newIcon = icon && h(Icon, { name: icon });
    const thisItem = {
      key: route.path,
      label: route.meta?.title || route.name,
      icon: newIcon,
      children,
      type: route.children ? "group" : undefined,
    };
    items.push(thisItem as ItemType);
  }
  return items;
}

onMounted(async () => {
  const items = await generateMenuItems(routes);
  TheMenu.data.menuItems.push(...items);
});

function onSelect({ key }: { key: string }) {
  router.push(key);
}
</script>

<style lang="scss" scoped>
.the-menu-wrapper {
  .the-menu {
    position: fixed;
    top: 88px;
    left: 0;
    width: 256px;
    height: calc(100vh - 88px);
    transition: width 0.3s;
  }
  .the-menu-clapsed {
    width: 0;
  }
}
</style>
