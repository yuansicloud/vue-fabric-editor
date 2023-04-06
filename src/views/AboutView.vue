<!-- src/views/Home.vue -->
<template>
  <div class="page-header-wrapper">
    <headerComponent />
    <div class="page-home">
      <div class="home-side-bar">
        <sidebar />
      </div>
      <div class="clearfix my-page-list">
        <myTemplates class="sub-page" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import sidebar from '@/components/dashboard/sidebar.vue';
import { useMenuStore } from '@/store/menu';
import headerComponent from '@/components/dashboard/header.vue';
import myTemplates from '@/components/dashboard/myTemplates.vue';

export default defineComponent({
  components: {
    sidebar,
    headerComponent,
    myTemplates,
  },
  setup() {
    const menuStore = useMenuStore();

    return {
      menuStore,
    };
  },
});
</script>
<style scoped>
.content {
  position: fixed;
  left: 18%; /* 根据菜单栏的宽度调整，这里是 4 / 24 的百分比，因为菜单栏的 span 是 4 */
  background-color: #ffffff;
  width: 75%; /* 与 left 相对应，这里是 (24 - 4) / 24 的百分比，因为内容栏的 span 是 20 */
  height: calc(100% - 48px);
  overflow-y: auto;
}
.page-home {
  display: flex;
  width: 100%;
  height: 100%;
  background: rgb(240, 243, 244);
}
.home-side-bar {
  width: 200px;
  background-color: #fff;
  border-right: solid #e6ebed;
  padding-top: 8px;
  z-index: 2;
}
.my-page-list {
  flex: 1;
  height: 900px;
  padding: 30px 10px 10px;
}
.sub-page {
  height: 100%;
  display: flex;
}
.page-header-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}
</style>
