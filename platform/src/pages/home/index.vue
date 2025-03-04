<template>
  <div>
    <span>{{ t("common.home") }}</span>
    <br />
    <br />
    <a-card>
      <a-row>
        <a-col :span="24">Current time: {{ localObj.data.currentTime }}</a-col>
      </a-row>
      <br />
      <a-row>
        <a-col :span="6">Node: {{ localObj.data.systemInfo?.node }}</a-col>
        <a-col :span="6"
          >Platform: {{ localObj.data.systemInfo?.platform }}</a-col
        >
        <a-col :span="6">Arch: {{ localObj.data.systemInfo?.arch }}</a-col>
        <a-col :span="6">Cpus: {{ localObj.data.systemInfo?.cpus }}</a-col>
      </a-row>
      <a-row>
        <a-col :span="6">Memory: {{ localObj.data.systemInfo?.memory }}</a-col>
        <a-col :span="6">Uptime: {{ localObj.data.systemInfo?.uptime }}</a-col>
        <a-col :span="6"
          >Loadavg: {{ localObj.data.systemInfo?.loadavg }}</a-col
        >
        <a-col :span="6"
          >Totalmem: {{ localObj.data.systemInfo?.totalmem }}</a-col
        >
      </a-row>
      <a-row>
        <a-col :span="6"
          >Freemem: {{ localObj.data.systemInfo?.freemem }}</a-col
        >
        <a-col :span="6"
          >Hostname: {{ localObj.data.systemInfo?.hostname }}</a-col
        >
        <a-col :span="6">Type: {{ localObj.data.systemInfo?.type }}</a-col>
        <a-col :span="6"
          >Release: {{ localObj.data.systemInfo?.release }}</a-col
        >
      </a-row>
    </a-card>
    <br />
    <!-- case表格 -->
    <a-table
      :columns="localObj.data.columns"
      :dataSource="localObj.data.caseList"
      rowKey="id"
      :scroll="{ x: 'max-content' }"
    />

    <br />

    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="Activity name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="Instant delivery">
        <a-switch v-model:checked="formState.delivery" />
      </a-form-item>
      <a-form-item label="Activity type">
        <a-checkbox-group v-model:value="formState.type">
          <a-checkbox value="1" name="type">Online</a-checkbox>
          <a-checkbox value="2" name="type">Promotion</a-checkbox>
          <a-checkbox value="3" name="type">Offline</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="Resources">
        <a-radio-group v-model:value="formState.resource">
          <a-radio value="1">Sponsor</a-radio>
          <a-radio value="2">Venue</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="Activity form">
        <a-textarea v-model:value="formState.desc" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">Create</a-button>
        <a-button style="margin-left: 10px">Cancel</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import t from "@/locales";
import { getSystemInfo, getCaseList } from "@/api/case";
import { onMounted, onUnmounted, reactive, toRaw } from "vue";
import type { UnwrapRef } from "vue";
import dayjs from "dayjs";

type caseListLike = Exclude<Awaited<ReturnType<typeof getCaseList>>, undefined>;
type systemInfoLike = Awaited<ReturnType<typeof getSystemInfo>>;
const localObj = reactive({
  data: {
    systemInfo: null as systemInfoLike | null,
    healthTimer: null as number | null,
    currentTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    currentTimeTimer: null as number | null,
    columns: [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Case Name",
        dataIndex: "caseName",
        key: "caseName",
      },
      {
        title: "Case Token",
        dataIndex: "caseToken",
        key: "caseToken",
      },
      {
        title: "Case Timeout",
        dataIndex: "caseTimeout",
        key: "caseTimeout",
      },
      {
        title: "Return Time",
        dataIndex: "returnTime",
        key: "returnTime",
      },
      {
        title: "Case Succeed",
        dataIndex: "caseSucceed",
        key: "caseSucceed",
        //boolean
        customRender: (obj) => {
          return obj.value ? "Yes" : "No";
        },
      },
      {
        title: "Case Finished",
        dataIndex: "caseFinished",
        key: "caseFinished",
        //boolean
        customRender: (obj) => {
          return obj.value ? "Yes" : "No";
        },
      },
      {
        title: "Create Time",
        dataIndex: "createTime",
        key: "createTime",
      },
      {
        title: "Update Time",
        dataIndex: "updateTime",
        key: "updateTime",
      },
      {
        title: "Expected Time",
        dataIndex: "expectedTime",
        key: "expectedTime",
      },
      {
        title: "Service ID",
        dataIndex: "serviceId",
        key: "serviceId",
      },
      {
        title: "Retry Count",
        dataIndex: "retryCount",
        key: "retryCount",
      },
      {
        title: "Max Retry",
        dataIndex: "maxRetry",
        key: "maxRetry",
      },
    ] as {
      title: string;
      dataIndex: string;
      key: Required<string>;
    }[],
    caseList: [] as caseListLike,
  },
});

interface FormState {
  name: string;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}
const formState: UnwrapRef<FormState> = reactive({
  name: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});
const onSubmit = () => {
  console.log("submit!", toRaw(formState));
};
const labelCol = { style: { width: "150px" } };
const wrapperCol = { span: 14 };

onMounted(() => {
  localObj.data.healthTimer = setInterval(() => {
    getSystemInfo().then((res) => {
      localObj.data.systemInfo = res;
    });
  }, 5000);
  localObj.data.currentTimeTimer = setInterval(() => {
    localObj.data.currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  }, 1000);

  getCaseList({
    pageNo: 1,
    pageSize: 10,
  }).then((res) => {
    if (!res) return;
    localObj.data.caseList.push(...res);
  });
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
