---
layout: page
title: Vue 测试
---

<script setup>
import { ref } from 'vue'

const count = ref(0)
const message = ref('Hello from Vue!')
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="count++">点击增加</button>
  </div>
</template>

<style scoped>
div {
  padding: 2rem;
}
</style>
