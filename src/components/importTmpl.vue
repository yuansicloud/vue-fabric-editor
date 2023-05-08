<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-11 23:31:30
 * @Description: 导入模板
-->

<template>
  <div style="display: inline-block">
    <Divider plain orientation="left">{{ $t('title_template') }}</Divider>
    <Tooltip
      :content="item.label"
      v-for="(item, i) in list"
      :key="i + '-bai1-button'"
      placement="top"
    >
      <img
        class="tmpl-img"
        :alt="item.label"
        v-lazy="item.src"
        @click="getTempData(item.tempUrl)"
      />
    </Tooltip>
  </div>
</template>

<script>
import select from '@/mixins/select';
import { downFontByJSON } from '@/utils/utils';
import axios from 'axios';
// const repoSrc = import.meta.env.APP_REPO;
export default {
  name: 'ImportTmpl',
  mixins: [select],
  data() {
    return {
      jsonFile: null,
      list: [
        {
          label: '讣告黑色模板',
          tempUrl: 'src/templates/obituary/49234261-0187-4fdc-be80-f9dfb14c8bc6.json',
          src: 'src/templates/obituary/49234261-0187-4fdc-be80-f9dfb14c8bc6.png',
        },
        {
          label: '讣告白色海报',
          tempUrl: 'src/templates/obituary/6ff9093a-4976-416b-8285-db5496842487.json',
          src: 'src/templates/obituary/6ff9093a-4976-416b-8285-db5496842487.png',
        },
      ],
    };
  },
  // created() {
  //   this.getTempList();
  // },
  methods: {
    // 插入文件
    insertSvgFile() {
      this.$Spin.show({
        render: (h) => h('div', this.$t('alert.loading_fonts')),
      });

      downFontByJSON(this.jsonFile)
        .then(() => {
          this.$Spin.hide();
          this.canvas.c.loadFromJSON(this.jsonFile, () => {
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
    // 获取模板列表数据
    // getTempList() {
    //   this.$Spin.show({
    //     render: (h) => h('div', this.$t('alert.loading_data')),
    //   });
    //   const getTemp = axios.get(repoSrc + 'template/index.json');
    //   getTemp
    //     .then((res) => {
    //       this.list = res.data.data.map((item) => {
    //         item.tempUrl = repoSrc + item.tempUrl;
    //         item.src = repoSrc + item.src;
    //         return item;
    //       });
    //       this.$Spin.hide();
    //     })
    //     .catch(this.$Spin.hide);
    // },
    // 获取模板数据
    getTempData(tempUrl) {
      this.$Spin.show({
        render: (h) => h('div', this.$t('alert.loading_data')),
      });
      const getTemp = axios.get(tempUrl);
      getTemp.then((res) => {
        this.jsonFile = JSON.stringify(res.data);
        this.insertSvgFile();
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
