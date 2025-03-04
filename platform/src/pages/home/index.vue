<template>
  <div>
    <span>{{ t("common.home") }}</span>
    <br />
    <br />
    <TheHeader :localObj="localObj" />
    <br />
    <br />
    <TheTable :localObj="localObj" />
    <br />
    <TheForm :localObj="localObj" />
  </div>
</template>

<script setup lang="ts">
import t from "@/locales";
import { reactive, onMounted } from "vue";
import TheHeader from "./components/TheHeader.vue";
import TheTable from "./components/TheTable.vue";
import TheForm from "./components/TheForm.vue";
import dayjs from "dayjs";
export type localObjLike = typeof localObj;
const localObj = reactive({
  data: {
    systemInfo: null as systemInfoLike | null,
    healthTimer: null as number | null,
    currentTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    currentTimeTimer: null as number | null,
  },
});

onMounted(() => {
  localObj.data.currentTimeTimer = setInterval(() => {
    localObj.data.currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  }, 1000);
});
</script>

<style scoped></style>
