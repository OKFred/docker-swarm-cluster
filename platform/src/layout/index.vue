<template>
  <div>
    <header>
      <TheMenu />
      <!-- Add your header content here -->
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <Button type="primary" @click="changeLang()">Primary Button</Button>
      <Button type="primary" @click="changeTheme()">Primary Button</Button>
      <!-- Add your footer content here -->
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Button } from "ant-design-vue";
import { useLocaleStore } from "@/stores/locale.ts";
import { useThemeStore } from "@/stores/theme.ts";
import TheMenu from "./components/TheMenu.vue";
const localeStore = useLocaleStore();
const themeStore = useThemeStore();
function changeLang() {
  console.log("changeLang");
  localeStore.changeLang();
}

function changeTheme() {
  console.log("changeTheme");
  themeStore.changeTheme();
}
</script>

<style scoped>
/* Add your styles here */
</style>
