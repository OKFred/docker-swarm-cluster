<template>
  <div class="the-layout">
    <TheHeader />
    <TheMenu />
    <!-- Add your header content here -->
    <TheContent />
    <footer>
      <!-- Add your footer content here -->
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from "@/stores/loading";
import TheMenu from "./components/TheMenu.vue";
import TheHeader from "./components/TheHeader.vue";
import TheContent from "./components/TheContent.vue";
import { onMounted } from "vue";

const loadingStore = useLoadingStore();
onMounted(() => {
  loadingStore.setLoading(false);
});
</script>

<style scoped lang="scss"></style>
