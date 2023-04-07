<template>
  <div style="display: inline-block">
    <Divider plain orientation="left" @click="modal = true">{{ $t('title_template') }}</Divider>
    <Tooltip
      :content="item.label"
      v-for="(item, i) in list"
      :key="i + '-bai1-button'"
      placement="top"
    >
      <div>挽联：{{ i + 1 }}</div>
      <img
        class="tmpl-img"
        :alt="item.label"
        v-lazy="item.src"
        @click="getTempData(item.tempUrl)"
      />
      <img
        class="tmpl-img"
        :alt="item.label"
        v-lazy="item.src"
        @click="getTempData(item.tempUrl)"
      />
    </Tooltip>
    <Modal v-model="modal" title="挽联信息" @on-ok="ok" @on-cancel="cancel">
      <div class="modal-button">
        <Button @click="addItem">增加挽联</Button>
      </div>
      <div class="form-modal">
        <Form>
          <FormItem label="逝者：">
            <Input v-model="decedentTitle" placeholder="名字"></Input>
          </FormItem>
        </Form>
      </div>

      <div v-for="(pageData, index) in pageDataList" :key="index">
        <div>挽联信息 {{ index + 1 }}</div>
        <Form class="form-modal" :model="pageData" :label-width="80">
          <FormItem label="家属名：">
            <Input v-model="pageData.title" placeholder="名字"></Input>
          </FormItem>
          <FormItem label="关系：">
            <Select v-model="pageData.key">
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
          </FormItem>
          <!-- 段落一 -->
          <FormItem label="段落：">
            <Input v-model="pageData.input" placeholder="例如：携全家"></Input>
          </FormItem>
          <!-- 讣告预览 -->
          <!-- 上联 -->
          <FormItem label="上联：">
            {{ pageData.input }}
          </FormItem>
          <!-- 下联 -->
          <FormItem label="下联：">
            {{ pageData.input }}
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import select from '@/mixins/select';
import { downFontByJSON } from '@/utils/utils';
import axios from 'axios';
// import { getRelationship } from '@/utils/relationship';

const repoSrc = import.meta.env.APP_REPO;
export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      modal: false,
      decedentTitle: '',
      pageDataList: [
        {
          key: '',
          title: '',
        },
      ],
      jsonFile: null,
      list: [
        {
          label: '海报模板',
          tempUrl: repoSrc + 'template/49234261-0187-4fdc-be80-f9dfb14c8bc6.json',
          src: repoSrc + 'template/49234261-0187-4fdc-be80-f9dfb14c8bc6.png',
        },
        {
          label: '旅游海报',
          tempUrl: repoSrc + 'template/6ff9093a-4976-416b-8285-db5496842487.json',
          src: repoSrc + 'template/6ff9093a-4976-416b-8285-db5496842487.png',
        },
        {
          label: '邀请海报',
          tempUrl: repoSrc + 'template/b40fee28-de9f-4304-a07e-2f55d36f137e.json',
          src: repoSrc + 'template/b40fee28-de9f-4304-a07e-2f55d36f137e.png',
        },
      ],
    };
  },
  methods: {
    // getRelationship() {},
    addItem() {
      this.pageDataList.push({ key: '', title: '' });
    },
    removeItem() {
      if (this.pageDataList.length > 1) {
        this.pageDataList.pop();
      }
    },
    ok() {
      this.$Message.info('Clicked ok');
    },
    cancel() {
      this.$Message.info('Clicked cancel');
    },
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
    // 获取模板数据
    getTempData(tmplUrl) {
      this.$Spin.show({
        render: (h) => h('div', this.$t('alert.loading_data')),
      });
      const getTemp = axios.get(tmplUrl);
      getTemp.then((res) => {
        this.jsonFile = JSON.stringify(res.data);
        this.insertSvgFile();
        console.log('123', this.jsonFile);
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
.modal-button {
  align-content: center;
  justify-items: center;
  text-align: right;
  margin: 10px;
}
.form-modal {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
}
</style>
