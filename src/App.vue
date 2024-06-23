<template>
  <a-config-provider :locale="zh_CN">
    <MainComponent></MainComponent>
  </a-config-provider>
</template>

<script setup lang="ts">
import MainComponent from './components/MainComponent.vue'
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
</script>

<style scoped></style>
