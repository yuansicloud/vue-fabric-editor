<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/components/Header.vue -->
<template>
  <Row class="header">
    <Col :span="12" class="logo-container">
      <div class="logo">
        <!-- 在此处插入你的logo图片 -->
      </div>
    </Col>
    <Col :span="12" class="right-container">
      <!-- 在此处添加你需要的其他内容 -->
    </Col>
  </Row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>

<style scoped>
.header {
  background-color: #1c1c1c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-container,
.right-container {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
