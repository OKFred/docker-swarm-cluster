<template>
  <!-- contentWrapper -->
  <div>
    <div class="content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.content-wrapper {
  margin: 24px;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e9e9e9;
  background: #fff;
}
</style>
