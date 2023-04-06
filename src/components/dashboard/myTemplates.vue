<template>
  <div class="clearfix my-page-list">
    <div class="scroll-wrapper page-list-wrapper">
      <Scroll height="800">
        <div class="page-content">
          <!--页面列表-->
          <div class="page-item-wrapper">
            <div class="page-item" v-for="(item, i) in list" :key="i + '-bai1-button'">
              <thumbnail-panel
                :image-src="list.src"
                @refresh="list"
                @showPreview="showPreviewFn"
                :pageData="item"
                :btnList="['useTemplate']"
                :showMoreBtn="false"
                :showPublishState="false"
              />
            </div>
          </div>
        </div>
      </Scroll>
    </div>
    <!-- 预览 -->
    <preview-page v-if="showPreview" @closePreview="showPreview = false"></preview-page>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const repoSrc = import.meta.env.APP_REPO;
import thumbnailPanel from '@/components/thumbnail-panel';
import previewPage from '@/views/components/preview-template.vue';
const list = ref([
  {
    label: '海报模板',
    // eslint-disable-next-line no-undef
    tempUrl: repoSrc + 'template/49234261-0187-4fdc-be80-f9dfb14c8bc6.json',
    // eslint-disable-next-line no-undef
    src: repoSrc + 'template/49234261-0187-4fdc-be80-f9dfb14c8bc6.png',
  },
  {
    label: '旅游海报',
    // eslint-disable-next-line no-undef
    tempUrl: repoSrc + 'template/6ff9093a-4976-416b-8285-db5496842487.json',
    // eslint-disable-next-line no-undef
    src: repoSrc + 'template/6ff9093a-4976-416b-8285-db5496842487.png',
  },
  {
    label: '邀请海报',
    // eslint-disable-next-line no-undef
    tempUrl: repoSrc + 'template/b40fee28-de9f-4304-a07e-2f55d36f137e.json',
    // eslint-disable-next-line no-undef
    src: repoSrc + 'template/b40fee28-de9f-4304-a07e-2f55d36f137e.png',
  },
]);
const showPreview = ref(false);

const showPreviewFn = () => {
  showPreview.value = true;
};
</script>

<style lang="less" scoped>
.my-page-list {
  height: 100%;
}

.page-list-wrapper {
  height: 100%;
}

.my-page-nav-list {
  height: 40px;
  line-height: 40px;
  z-index: 2;
  margin-bottom: 20px;
  .my-page-nav-item {
    float: left;
    padding-right: 32px;
    text-align: center;
    cursor: pointer;
  }
}

.full-input-w {
  width: 100%;
}

.nav-tabs-label {
  display: inline-block;
  padding: 0 16px;
  height: 60px;
  line-height: 60px;
}

.page-item-wrapper {
  .page-item {
    float: left;
    margin-right: 20px;

    margin-bottom: 40px;
  }
}
</style>
