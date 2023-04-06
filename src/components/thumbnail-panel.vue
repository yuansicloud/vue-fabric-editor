<template>
  <div class="page-thumbnail-panel">
    <div class="thumbnail-panel-cover">
      <div class="header-mask">
        <div class="details-btn" @click="preview()">预览</div>
      </div>
      <div class="image-wrapper">
        <img :src="pageData.src" alt="" />
      </div>
    </div>
    <div class="page-item-title border-T ellipsis">
      <span class="item-title-i">{{ pageData.label }}</span>
    </div>
    <div class="border-T thumbnail-panel-btn" v-if="btnList.includes('useTemplate')">
      <div class="btn-wrapper">
        <el-button type="text" size="mini" @click="usePage">使用模板</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';

interface PageData {
  src: string;
  label: string;
}

export default defineComponent({
  props: {
    pageData: {
      type: Object as PropType<PageData>,
      required: true,
    },
    btnList: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
    },
  },
  setup(_, { emit }) {
    const router = useRouter();
    const preview = () => {
      emit('showPreview');
    };
    const usePage = () => {
      router.push({ name: 'Editor' });
    };
    return {
      preview,
      usePage,
    };
  },
});
</script>

<style lang="less" scoped>
.page-thumbnail-panel {
  width: 224px;
  height: 296px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  transition: all 0.28s;

  &:hover {
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.16);
    transform: translate3d(0, -2px, 0);

    .header-mask {
      opacity: 1;
    }
  }

  .header-mask {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    border-radius: 4px 4px 0 0;
    padding-top: 92px;
    text-align: center;
    transition: top 0.28s ease, opacity 0.28s ease, height 0.28s ease;

    .details-btn {
      display: inline-block;
      width: 120px;
      height: 44px;
      font-size: 18px;
      line-height: 44px;
      border-radius: 22px;
      border: 1px solid #fff;
      color: #fff;
      cursor: pointer;
    }
  }
}

.thumbnail-panel-cover {
  flex: 1;
  position: relative;

  .image-wrapper {
    width: 224px;
    height: 224px;
    overflow: hidden;
    padding: 5px;
    z-index: 10;

    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}

.page-item-title {
  height: 36px;
  line-height: 36px;
  padding: 0 8px;
  font-size: 14px;
}

.thumbnail-panel-btn {
  height: 36px;
  width: 100%;
  display: flex;
  flex-direction: row;

  .btn-wrapper {
    flex: 1;
    text-align: center;
  }
}

.border-T {
  border-top: 1px solid #ebeef5;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
