<template>
  <FontAwesomeIcon v-if="icon" :="{ ...props.faObj }" :icon="icon" />
</template>

<script lang="ts" setup>
import { ref, watch, type PropType } from "vue";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { iconMap, type iconMapLike } from "./icons"; // ✅ 统一管理图标

//继承FontAwesomeIconProps，除了icon，
//并补充了name属性，用于指定图标名称
const props = defineProps({
  faObj: {
    type: Object as PropType<Partial<FontAwesomeIconProps>>,
    default: () => ({}),
  },
  icon: { type: Object as PropType<IconDefinition>, default: null },
  name: {
    type: String as PropType<keyof iconMapLike>,
    required: true,
  },
});

const icon = ref<IconDefinition | null>(null);

watch(
  () => props.name,
  (val) => {
    if (!val) return;
    if (iconMap[val as keyof typeof iconMap]) {
      library.add(iconMap[val as keyof typeof iconMap]);
      icon.value = iconMap[val as keyof typeof iconMap];
    } else {
      console.error(`⚠️ Icon not found: ${val}`);
    }
  },
  { immediate: true },
);
</script>
