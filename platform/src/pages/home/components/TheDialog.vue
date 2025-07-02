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
        <div style="margin-bottom: 8px">
          <a-radio-group v-model:value="TheDialog.data.serviceMode" @change="onServiceModeChange">
            <a-radio value="normal">普通模式</a-radio>
            <a-radio value="custom">自定义模式</a-radio>
          </a-radio-group>
        </div>
        
        <!-- 普通模式 -->
        <div v-if="TheDialog.data.serviceMode === 'normal'">
          <a-form-item label="Image" name="image" required>
            <a-input v-model:value="TheDialog.data.normalConfig.image" placeholder="容器镜像名称" />
          </a-form-item>
          
          <a-form-item label="环境变量" name="env">
            <div v-for="(envItem, index) in TheDialog.data.normalConfig.env" :key="index" style="display: flex; margin-bottom: 8px; align-items: center;">
              <a-input 
                v-model:value="envItem.key" 
                placeholder="KEY" 
                style="margin-right: 8px;"
              />
              <span style="margin: 0 8px;">=</span>
              <a-input 
                v-model:value="envItem.value" 
                placeholder="VALUE" 
                style="margin-right: 8px;"
              />
              <a-button @click="removeEnvItem(index)" type="text" danger>删除</a-button>
            </div>
            <a-button @click="addEnvItem" type="dashed" block>添加环境变量</a-button>
          </a-form-item>
          
          <a-form-item label="重启策略" name="restartCondition">
            <a-select v-model:value="TheDialog.data.normalConfig.restartCondition" style="width: 200px;">
              <a-select-option value="none">none</a-select-option>
              <a-select-option value="on-failure">on-failure</a-select-option>
              <a-select-option value="any">any</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item label="内存限制" name="memoryLimit">
            <a-input-number 
              v-model:value="TheDialog.data.normalConfig.memoryLimit" 
              :min="1"
              placeholder="例如: 512"
              style="width: 120px; margin-right: 8px;"
            />
            <span>MB</span>
          </a-form-item>
          
          <a-form-item label="副本数量" name="replicas">
            <a-input-number 
              v-model:value="TheDialog.data.normalConfig.replicas" 
              :min="1"
              style="width: 120px;"
            />
          </a-form-item>
        </div>
        
        <!-- 自定义模式 -->
        <a-textarea
          v-else
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
    serviceMode: "normal" as "normal" | "custom",
    normalConfig: {
      image: "",
      env: [{ key: "", value: "" }] as Array<{ key: string; value: string }>,
      restartCondition: "on-failure" as "none" | "on-failure" | "any",
      memoryLimit: 512,
      replicas: 1,
    },
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

function onServiceModeChange() {
  // 当切换模式时，清空相关配置
  if (TheDialog.data.serviceMode === "normal") {
    TheDialog.data.formObj.serviceOptions = "";
  }
}

function addEnvItem() {
  TheDialog.data.normalConfig.env.push({ key: "", value: "" });
}

function removeEnvItem(index: number) {
  if (TheDialog.data.normalConfig.env.length > 1) {
    TheDialog.data.normalConfig.env.splice(index, 1);
  }
}

function onSubmit() {
  const finalData = { ...TheDialog.data.formObj };
  //移除非0空值
  for (const key in finalData) {
    if (finalData[key] === 0 || finalData[key] === "") {
      delete finalData[key];
    }
  }

  // 处理 serviceOptions
  if (TheDialog.data.serviceMode === "normal") {
    // 普通模式验证
    const config = TheDialog.data.normalConfig;
    if (!config.image.trim()) {
      message.error("Image 字段是必填的");
      return;
    }
    if (!config.memoryLimit || config.memoryLimit <= 0) {
      message.error("内存限制必须大于 0");
      return;
    }
    if (!config.replicas || config.replicas <= 0) {
      message.error("副本数量必须大于 0");
      return;
    }

    // 构建环境变量数组
    const envArray = config.env
      .filter((item: { key: string; value: string }) => item.key.trim() && item.value.trim())
      .map((item: { key: string; value: string }) => `${item.key}=${item.value}`);

    // 构建普通模式的 serviceOptions
    const serviceOptions = {
      Name: `case-service-${Date.now()}`,
      TaskTemplate: {
        ContainerSpec: {
          Image: config.image,
          Env: envArray,
        },
        RestartPolicy: {
          Condition: config.restartCondition,
        },
        Resources: {
          Limits: { 
            MemoryBytes: config.memoryLimit * 1024 * 1024, // 转换为字节
          },
        },
        Placement: {
          Constraints: ["node.labels.role == case"],
        },
      },
      Mode: {
        Replicated: {
          Replicas: config.replicas,
        },
      },
    };

    finalData.serviceOptions = serviceOptions;
  } else {
    // 自定义模式验证
    if (finalData.serviceOptions) {
      try {
        const parsedOptions = JSON.parse(finalData.serviceOptions);
        
        // 检查是否有 Image 字段
        const hasImage = parsedOptions?.TaskTemplate?.ContainerSpec?.Image;
        if (!hasImage) {
          message.error("自定义模式必须包含 TaskTemplate.ContainerSpec.Image 字段");
          return;
        }
        
        finalData.serviceOptions = parsedOptions;
      } catch (error) {
        message.error("Service Options must be a valid JSON string");
        return;
      }
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
  TheDialog.data.serviceMode = "normal";
  TheDialog.data.normalConfig = {
    image: "",
    env: [{ key: "", value: "" }],
    restartCondition: "on-failure",
    memoryLimit: 512,
    replicas: 1,
  };
}
</script>

<style lang="scss" scoped>
.case-name,
.case-token {
  width: 100px;
}
</style>
