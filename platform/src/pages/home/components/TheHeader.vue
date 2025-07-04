<template>
  <a-card>
    <a-row>
      <a-col :span="24">当前时间: {{ localObj.data.currentTime }}</a-col>
    </a-row>
    <br />
    <a-row>
      <a-col :span="6">节点: {{ TheHeader.data.systemInfo?.node }}</a-col>
      <a-col :span="6">平台: {{ TheHeader.data.systemInfo?.platform }}</a-col>
      <a-col :span="6">架构: {{ TheHeader.data.systemInfo?.arch }}</a-col>
      <a-col :span="6">CPU: {{ TheHeader.data.systemInfo?.cpus }}</a-col>
    </a-row>
    <a-row>
      <a-col :span="6">运行时间: {{ TheHeader.data.systemInfo?.uptime }}</a-col>
      <a-col :span="6"
        >负载均衡: {{ TheHeader.data.systemInfo?.loadavg }}</a-col
      >
      <a-col :span="6">总内存: {{ TheHeader.data.systemInfo?.totalmem }}</a-col>
      <a-col :span="6"
        >空闲内存: {{ TheHeader.data.systemInfo?.freemem }}</a-col
      >
    </a-row>
    <a-row>
      <a-col :span="6">主机名: {{ TheHeader.data.systemInfo?.hostname }}</a-col>
      <a-col :span="6">类型: {{ TheHeader.data.systemInfo?.type }}</a-col>
      <a-col :span="6">版本: {{ TheHeader.data.systemInfo?.release }}</a-col>
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

function formatTime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${days}天 ${hours}小时 ${minutes}分钟 ${secs}秒`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  else if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  else return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

async function loadData() {
  const res = await getSystemInfo();
  TheHeader.data.systemInfo = {
    ...res.data,
    uptime: formatTime(res.data.uptime),
    freemem: formatBytes(res.data.freemem),
    totalmem: formatBytes(res.data.totalmem),
  };
}
</script>

<style scoped></style>
