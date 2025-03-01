<template>
  <FontAwesomeIcon v-if="icon" :icon="icon" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { iconMap } from "./icons"; // ✅ 统一管理图标

const props = defineProps<{ name: string }>();

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
