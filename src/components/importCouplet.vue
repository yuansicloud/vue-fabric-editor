<template>
  <div style="display: inline-block">
    <Divider plain orientation="left" @click="addCouplet">挽联</Divider>
    <div v-display="flex">
      <Button size="small" type="primary">新建</Button>
      <Button size="small" type="warning">清空</Button>
    </div>
    <div v-for="(item, i) in list" :key="i" @click="renderContent(item)">
      {{ item.name }}
    </div>
    <Modal v-model="showModal" title="创建挽联" width="500">
      <p>Customize width, unit px, default 520px.</p>
      <p>
        The width of the dialog box is responsive, and the width becomes
        <code>auto</code>
        when the screen size is less than 768px.
      </p>
    </Modal>
  </div>
</template>

<script>
import select from '@/mixins/select';
import { downFontByJSON } from '@/utils/utils';
import axios from 'axios';
import { coupletFirstSingleDefault } from '@/templates/couplet';
export default {
  name: 'ToolBar',
  mixins: [select],
  computed: {
    // 从 Vuex store 获取 list
    list() {
      return this.$store.state.couplets.couplets;
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    addCouplet() {
      const newCouplet = {
        name: new Date(),
        content: coupletFirstSingleDefault,
      };
      this.$store.dispatch('couplets/addCouplet', newCouplet);
    },
    // 渲染内容
    renderContent(couplet) {
      var json = JSON.stringify(couplet.content);
      downFontByJSON(json)
        .then(() => {
          this.$Spin.hide();
          this.canvas.c.loadFromJSON(json, () => {
            this.canvas.c.renderAll.bind(this.canvas.c);
            setTimeout(() => {
              const workspace = this.canvas.c.getObjects().find((item) => item.id === 'workspace');
              workspace.set('selectable', false);
              workspace.set('hasControls', false);
              this.canvas.c.requestRenderAll();
              this.canvas.editor.editorWorkspace.setSize(workspace.width, workspace.height);
              this.canvas.c.renderAll();
              this.canvas.c.requestRenderAll();
            }, 100);
          });
        })
        .catch(() => {
          this.$Spin.hide();
          this.$Message.error(this.$t('alert.loading_fonts_failed'));
        });
    },
  },
};
</script>

<style scoped lang="less">
.tmpl-img {
  width: 94px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
