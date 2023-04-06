<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/components/Sidebar.vue -->
<template>
  <div class="sidebar">
    <Menu mode="vertical" width="190" :active-name="activeMenuItem" @on-select="handleSelect">
      <MenuItem name="1">
        <Icon type="md-document" />
        模板市场
      </MenuItem>
    </Menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMenuStore } from '@/store/menu';

export default defineComponent({
  setup() {
    const menuStore = useMenuStore();
    const handleSelect = (item: string) => {
      menuStore.setActiveMenuItem(item);
    };

    return {
      activeMenuItem: menuStore.activeMenuItem,
      handleSelect,
    };
  },
});
</script>
<style scoped>
.sidebar {
  z-index: 100;
  height: 900px;
}
</style>
