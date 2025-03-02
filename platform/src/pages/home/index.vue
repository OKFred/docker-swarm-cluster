<template>
  <div>
    <span>{{ t("common.home") }}</span>
    <br />
    <br />
    <div>
      <a-card>
        <a-row>
          <a-col :span="24"
            >Current time: {{ localObj.data.currentTime }}</a-col
          >
        </a-row>
        <br />
        <a-row>
          <a-col :span="6">Node: {{ localObj.data.systemInfo.node }}</a-col>
          <a-col :span="6"
            >Platform: {{ localObj.data.systemInfo.platform }}</a-col
          >
          <a-col :span="6">Arch: {{ localObj.data.systemInfo.arch }}</a-col>
          <a-col :span="6">Cpus: {{ localObj.data.systemInfo.cpus }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="6">Memory: {{ localObj.data.systemInfo.memory }}</a-col>
          <a-col :span="6">Uptime: {{ localObj.data.systemInfo.uptime }}</a-col>
          <a-col :span="6"
            >Loadavg: {{ localObj.data.systemInfo.loadavg }}</a-col
          >
          <a-col :span="6"
            >Totalmem: {{ localObj.data.systemInfo.totalmem }}</a-col
          >
        </a-row>
        <a-row>
          <a-col :span="6"
            >Freemem: {{ localObj.data.systemInfo.freemem }}</a-col
          >
          <a-col :span="6"
            >Hostname: {{ localObj.data.systemInfo.hostname }}</a-col
          >
          <a-col :span="6">Type: {{ localObj.data.systemInfo.type }}</a-col>
          <a-col :span="6"
            >Release: {{ localObj.data.systemInfo.release }}</a-col
          >
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import t from "@/locales";
import { getSystemInfo } from "@/api/case";
import { onMounted, onUnmounted, reactive, toRaw } from "vue";
import type { UnwrapRef } from "vue";
import dayjs from "dayjs";
const localObj = reactive({
  data: {
    systemInfo: {},
    healthTimer: null as number | null,
    currentTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    currentTimeTimer: null as number | null,
  },
});

onMounted(() => {
  localObj.data.healthTimer = setInterval(() => {
    getSystemInfo().then((res) => {
      localObj.data.systemInfo = res;
    });
  }, 5000);
  localObj.data.currentTimeTimer = setInterval(() => {
    localObj.data.currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  }, 1000);
});

onUnmounted(() => {
  if (localObj.data.healthTimer) {
    clearInterval(localObj.data.healthTimer);
    localObj.data.healthTimer = null;
  }
  if (localObj.data.currentTimeTimer) {
    clearInterval(localObj.data.currentTimeTimer);
    localObj.data.currentTimeTimer = null;
  }
});
</script>

<style scoped></style>
