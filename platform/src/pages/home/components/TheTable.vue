<template>
  <!-- case表格 -->
  <a-table
    :columns="TheTable.data.columns"
    :dataSource="TheTable.data.caseList"
    :pagination="{
      current: TheTable.data.pageNo,
      pageSize: TheTable.data.pageSize,
      total: TheTable.data.total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `Total ${total} items`,
      onChange: (pageNo, pageSize) => {
        TheTable.data.pageNo = pageNo;
        TheTable.data.pageSize = pageSize;
        TheTable.fn.loadData();
      },
    }"
    rowKey="id"
    :scroll="{ x: 'max-content' }"
  />
</template>

<script lang="ts" setup>
import { getCaseList } from "@/api/case";
import { onMounted, reactive } from "vue";
import dayjs from "dayjs";
import type { localObjLike } from "../index.vue";

type caseListLike = Awaited<ReturnType<typeof getCaseList>>["data"]["list"];

const props = defineProps({
  localObj: {
    type: Object,
    required: true,
  },
}) as { localObj: localObjLike };

export type TheTableLike = typeof TheTable;
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
        //time in ms
        customRender: (obj: { value: number }) => {
          return obj.value ? (obj.value / 1000).toFixed(2) + "s" : "0.00s";
        },
      },
      {
        title: "Return Time",
        dataIndex: "returnTime",
        key: "returnTime",
        customRender: (obj: { value: number }) => {
          return obj.value ? (obj.value / 1000).toFixed(2) + "s" : "0.00s";
        },
      },
      {
        title: "Case Succeed",
        dataIndex: "caseSucceed",
        key: "caseSucceed",
        //boolean
        customRender: (obj: { value: any }) => {
          return obj.value ? "Yes" : "No";
        },
      },
      {
        title: "Case Finished",
        dataIndex: "caseFinished",
        key: "caseFinished",
        //boolean
        customRender: (obj: { value: any }) => {
          return obj.value ? "Yes" : "No";
        },
      },
      {
        title: "Create Time",
        dataIndex: "createTime",
        key: "createTime",
        //time UTC
        customRender: (obj: {
          value: string | number | Date | dayjs.Dayjs | null | undefined;
        }) => {
          return obj.value
            ? dayjs(obj.value).format("YYYY-MM-DD HH:mm:ss")
            : "";
        },
      },
      {
        title: "Update Time",
        dataIndex: "updateTime",
        key: "updateTime",
        customRender: (obj: {
          value: string | number | Date | dayjs.Dayjs | null | undefined;
        }) => {
          return obj.value
            ? dayjs(obj.value).format("YYYY-MM-DD HH:mm:ss")
            : "";
        },
      },
      {
        title: "Expected Time",
        dataIndex: "expectedTime",
        key: "expectedTime",
        customRender: (obj: {
          value: string | number | Date | dayjs.Dayjs | null | undefined;
        }) => {
          return obj.value
            ? dayjs(obj.value).format("YYYY-MM-DD HH:mm:ss")
            : "";
        },
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
    pageSize: 10,
    pageNo: 1,
    total: 0,
  },
  fn: {
    loadData,
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
    data: {
      pageNo: TheTable.data.pageNo,
      pageSize: TheTable.data.pageSize,
    },
  }).then((res) => {
    if (!res) return;
    let { list, total, pageSize, pageNo } = res.data;
    if (pageSize) TheTable.data.pageSize = pageSize;
    if (pageNo) TheTable.data.pageNo = pageNo;
    if (total) TheTable.data.total = total;
    TheTable.data.caseList = [...list];
  });
}
</script>
