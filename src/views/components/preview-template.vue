<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <preview-wrapper @closePreview="closePreview">
    <p class="page-title paddingL30">页面预览</p>
    <div class="preview-info-wrapper">
      <el-form label-width="90px" label-position="left">
        <el-form-item label="页面二维码:">
          {{ 132465 }}
        </el-form-item>
        <el-form-item label="页面链接:">
          <div>
            <el-button type="primary">复制链接</el-button>
          </div>
          <div class="share-wx-config-wrapper">
            {{ 123465464 }}
          </div>
        </el-form-item>
        <!--页面效果-->
        <el-form-item label="页面信息:"></el-form-item>
      </el-form>
    </div>
  </preview-wrapper>
</template>

<script setup>
import { defineComponent } from 'vue';
import previewWrapper from '@/components/dashboard/preview-wrapper';

defineComponent({
  components: {
    previewWrapper,
  },
  setup(_, { emit }) {
    const closePreview = () => {
      emit('closePreview', false);
    };

    return {
      closePreview,
    };
  },
});
</script>
<style lang="less" scoped>
.preview-info-wrapper {
  padding: 30px 30px 60px;
  font-size: 16px;
}

.page-info {
  display: flex;
  padding: 12px;
  background-color: #f0f3f4;
  .page-cover {
    width: 80px;
    height: 80px;
    overflow: hidden;
  }
  .page-title-des {
    padding-left: 20px;
    flex: 1;
  }
}
.info-form-wrapper {
  display: flex;
  padding-bottom: 16px;
  .info-form-l {
    line-height: 42px;
    &.com-width {
      width: 120px;
    }
  }
  .info-form-r {
    flex: 1;
    padding-left: 10px;
  }
}
.share-wx-config-wrapper {
  margin-top: 14px;
  padding: 12px;
  background-color: #f0f3f4;
}
</style>
