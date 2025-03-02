<template>
  <FontAwesomeIcon :="{ ...props.faObj }" :icon="icon" />
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/vue-fontawesome";
import { iconMap } from "./icons";

//继承FontAwesomeIconProps，除了icon，
//并补充了name属性，用于指定图标名称
const props = defineProps({
  faObj: {
    type: Object as PropType<Partial<FontAwesomeIconProps>>,
  },
  name: {
    type: String as PropType<keyof typeof iconMap>,
    required: true,
  },
});

const icon = computed(() => iconMap[props?.name]);
</script>
