<template>
  <a-modal
    v-model:open="TheDialog.data.dialogVisible"
    title="添加任务"
    @cancel="onClose"
    @ok="onSubmit"
    width="60%"
  >
    <a-form :form="TheDialog.data.formObj">
      <a-form-item label="Case Name" name="caseName" tooltip="任务名称">
        <a-input
          v-model:value="TheDialog.data.formObj.caseName"
          class="case-name"
        />
      </a-form-item>
      <a-form-item label="Case Token" name="caseToken" tooltip="任务令牌">
        <a-input
          v-model:value="TheDialog.data.formObj.caseToken"
          class="case-token"
        />
      </a-form-item>
      <a-form-item
        label="Case Timeout"
        name="caseTimeout"
        tooltip="任务超时时间"
      >
        <a-input-number v-model:value="TheDialog.data.formObj.caseTimeout" />
      </a-form-item>
      <a-form-item label="Return Time" name="returnTime" tooltip="任务结束时间">
        <a-input-number v-model:value="TheDialog.data.formObj.returnTime" />
      </a-form-item>
      <a-form-item label="Max Retry" name="maxRetry" v-if="false">
        <a-input-number
          v-model:value="TheDialog.data.formObj.maxRetry"
          disabled
        />
      </a-form-item>
      <a-form-item
        label="Service Options"
        name="serviceOptions"
        tooltip="docker服务选项"
      >
        <a-textarea
          v-model:value="TheDialog.data.formObj.serviceOptions"
          :auto-size="{ minRows: 3, maxRows: 15 }"
          placeholder="JSON string"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { addCase } from "@/api/case";
import { onMounted, reactive } from "vue";
import type { localObjLike } from "../index.vue";
import { message } from "ant-design-vue";

const formStr = JSON.stringify({
  caseName: "",
  caseToken: "",
  caseTimeout: 120_000,
  returnTime: 120_000,
  serviceOptions: "",
} as Partial<Parameters<typeof addCase>["0"]["data"]>);

const props = defineProps({
  localObj: {
    type: Object,
    required: true,
  },
}) as { localObj: localObjLike };

export type TheDialogLike = typeof TheDialog;
const TheDialog = reactive({
  data: {
    dialogVisible: false,
    formObj: JSON.parse(formStr),
  },
  fn: {
    onOpen,
  },
});

onMounted(() => {
  mixin();
});

function mixin() {
  Object.assign(props.localObj, { TheDialog });
}

function onOpen() {
  TheDialog.data.dialogVisible = true;
}

function onSubmit() {
  const finalData = { ...TheDialog.data.formObj };
  //移除非0空值
  for (const key in finalData) {
    if (finalData[key] === 0 || finalData[key] === "") {
      delete finalData[key];
    }
  }
  /* {
    Name: `case-service-666`,
    TaskTemplate: {
      ContainerSpec: {
        Image: "process.env.CASE_IMAGE_NAME", // 使用预先构建好的镜像
        Env: [
          `SERVER_URL=http://localhost:3000`,
          `CASE_ID=666`,
          `CASE_TOKEN=999`,
        ], // 环境变量
      },
      RestartPolicy: {
        Condition: "on-failure", // 重启策略
      },
      Resources: {
        Limits: { MemoryBytes: 1000000000 }, // 根据需要配置资源限制
      },
      Placement: {
        Constraints: ["node.labels.role == case"], // 限制容器在拥有 'case' 标签的节点上运行
      },
    },
    Mode: {
      Replicated: {
        Replicas: 1,
      }, // 任务自动故障转移
    },
  } */
  if (finalData.serviceOptions) {
    try {
      finalData.serviceOptions = JSON.parse(finalData.serviceOptions);
    } catch (error) {
      message.error("Service Options must be a valid JSON string");
      return;
    }
  }
  addCase({ data: finalData }).then(() => {
    props.localObj.TheTable?.fn.loadData();
    onClose();
  });
}

function onClose() {
  TheDialog.data.dialogVisible = false;
  TheDialog.data.formObj = JSON.parse(formStr);
}
</script>

<style lang="scss" scoped>
.case-name,
.case-token {
  width: 100px;
}
</style>
