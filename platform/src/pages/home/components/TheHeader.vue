<template>
  <a-card>
    <a-row>
      <a-col :span="24">Current time: {{ localObj.data.currentTime }}</a-col>
    </a-row>
    <br />
    <a-row>
      <a-col :span="6">Node: {{ TheHeader.data.systemInfo?.node }}</a-col>
      <a-col :span="6"
        >Platform: {{ TheHeader.data.systemInfo?.platform }}</a-col
      >
      <a-col :span="6">Arch: {{ TheHeader.data.systemInfo?.arch }}</a-col>
      <a-col :span="6">Cpus: {{ TheHeader.data.systemInfo?.cpus }}</a-col>
    </a-row>
    <a-row>
      <a-col :span="6">Memory: {{ TheHeader.data.systemInfo?.memory }}</a-col>
      <a-col :span="6">Uptime: {{ TheHeader.data.systemInfo?.uptime }}</a-col>
      <a-col :span="6">Loadavg: {{ TheHeader.data.systemInfo?.loadavg }}</a-col>
      <a-col :span="6"
        >Totalmem: {{ TheHeader.data.systemInfo?.totalmem }}</a-col
      >
    </a-row>
    <a-row>
      <a-col :span="6">Freemem: {{ TheHeader.data.systemInfo?.freemem }}</a-col>
      <a-col :span="6"
        >Hostname: {{ TheHeader.data.systemInfo?.hostname }}</a-col
      >
      <a-col :span="6">Type: {{ TheHeader.data.systemInfo?.type }}</a-col>
      <a-col :span="6">Release: {{ TheHeader.data.systemInfo?.release }}</a-col>
    </a-row>
  </a-card>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import type { localObjLike } from "../index.vue";

import { getSystemInfo } from "@/api/system/index";
export type TheHeaderLike = typeof TheHeader;
const TheHeader = reactive({
  data: {
    systemInfo: null as
      | Awaited<ReturnType<typeof getSystemInfo>>["data"]
      | null,
  },
});

const props = defineProps({
  localObj: {
    type: Object,
    required: true,
  },
}) as { localObj: localObjLike };

onMounted(() => {
  mixin();
  loadData();
});

function mixin() {
  Object.assign(props.localObj, { TheHeader });
}

async function loadData() {
  const res = await getSystemInfo();
  TheHeader.data.systemInfo = res.data;
}
</script>

<style scoped></style>
