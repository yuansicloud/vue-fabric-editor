<template>
  <div class="components-preview">
    <div class="setting-bg"></div>
    <div class="left-panel">
      <div class="iframe-wrapper" :style="{ width: 100 + 'px', height: 800 + 'px' }">
        <canvas ref="myCanvas" id="myCanvas" class="fixed-canvas" width="100" height="100"></canvas>
      </div>
    </div>
    <div class="right-panel">
      <slot></slot>
    </div>
    <span class="cloase-btn" @click="closePreview">
      <i class="el-icon-close"></i>
    </span>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup(_, { emit }) {
    const myCanvas = ref(null);
    const scaleFactor = 2; // 您可以更改此值以调整缩放比例

    const closePreview = () => {
      emit('closePreview', false);
    };

    onMounted(() => {
      const ctx = myCanvas.value.getContext('2d');
      ctx.scale(scaleFactor, scaleFactor);
    });

    return {
      closePreview,
      myCanvas,
    };
  },
});
</script>

<style lang="less" scoped>
.components-preview-inner {
  width: 100%;
}

.setting-bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1042;
}
.left-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 640px;
  z-index: 1050;
  overflow: hidden;
}
.right-panel {
  position: fixed;
  width: 640px;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  background-color: #fff;
  overflow-y: auto;
  color: #333;
}
.iframe-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -185px;
  margin-top: -334px;
  background: white;
}
.fixed-canvas {
  position: absolute;
  left: 0;
  top: 0;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
.cloase-btn {
  position: fixed;
  top: 8px;
  right: 20px;
  font-size: 28px;
  color: #7f8593;
  -webkit-transition: all 0.28s;
  transition: all 0.28s;
  z-index: 1060;
  cursor: pointer;
}
</style>
