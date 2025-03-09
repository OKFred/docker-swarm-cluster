<template>
  <div class="on-the-right">
    <div class="my-default-padding">
      <a-button
        size="large"
        type="primary"
        class="the-button the-button-add"
        @click="props.localObj.TheDialog?.fn.onOpen()"
      >
        <Icon name="fas:plus" />
        <span class="the-button-text">Add</span>
      </a-button>
    </div>
    <div class="my-default-padding">
      <a-button
        type="primary"
        size="large"
        class="the-button"
        @click="props.localObj.TheTable?.fn.loadData()"
        ><!-- 
        Query -->
        <Icon name="fas:search" />
        <span class="the-button-text">Query</span>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import type { localObjLike } from "../index.vue";
import Icon from "@/components/Icon/index.vue";

const props = defineProps({
  localObj: {
    type: Object,
    required: true,
  },
}) as { localObj: localObjLike };

export type TheFilterLike = typeof TheFilter;
const TheFilter = reactive({
  data: {},
  fn: {},
});

onMounted(() => {
  mixin();
  loadData();
});

function mixin() {
  Object.assign(props.localObj, { TheFilter });
}

async function loadData() {}
</script>

<style scoped lang="scss">
.on-the-right {
  display: flex;
  justify-content: flex-end;
}

.the-button {
  background-color: #1890ff;
  color: white;
}
.the-button-add {
  background-color: #52c41a;
}
.the-button-text {
  margin: 0 15px;
}
</style>
