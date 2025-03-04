<template>
  <!-- case表格 -->
  <a-table
    :columns="TheTable.data.columns"
    :dataSource="TheTable.data.caseList"
    rowKey="id"
    :scroll="{ x: 'max-content' }"
  />
</template>

<script lang="ts" setup>
import { getCaseList } from "@/api/case";
import { onMounted, reactive } from "vue";
import dayjs from "dayjs";
import type { localObjLike } from "./index.vue";

type caseListLike = Exclude<Awaited<ReturnType<typeof getCaseList>>, undefined>;

const props = defineProps({
  localObj: {
    type: Object,
    required: true,
  },
}) as { localObj: localObjLike };

const TheTable = reactive({
  data: {
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

onMounted(() => {
  mixin();
  loadData();
});

function mixin() {
  Object.assign(props.localObj, { TheTable });
}

async function loadData() {
  getCaseList({
    pageNo: 1,
    pageSize: 10,
  }).then((res) => {
    if (!res) return;
    TheTable.data.caseList.push(...res);
  });
}
</script>
