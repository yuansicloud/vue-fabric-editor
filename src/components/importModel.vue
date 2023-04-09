<template>
  <div style="display: inline-block">
    <Divider plain orientation="left" @click="modal = true">
      {{ $t('title_model') }}
    </Divider>
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
    <Modal
      width="800px"
      class="modal-list"
      v-model="modal"
      title="挽联信息"
      @on-ok="ok"
      @on-cancel="cancel"
      :mask-closable="false"
    >
      <div class="modal-button">
        <Button @click="addItem">增加挽联</Button>
      </div>

      <div class="form-modal">
        <Form>
          <FormItem label="逝者：">
            <Input
              size="default"
              style="width: 200px"
              v-model="decedentTitle"
              placeholder="名字"
            ></Input>
          </FormItem>
        </Form>
        <div v-for="(couplet, index) in coupletList" :key="index">
          <div style="display: flex; justify-content: space-between">
            <div>挽联信息 {{ index + 1 }}</div>
            <div class="icon-container" v-show="coupletList.length > 1" @click="removeItem(index)">
              <Icon color="#000000" size="20" type="ios-close" />
            </div>
          </div>

          <Form class="form-modal" :model="couplet" :label-width="80">
            <Button class="modal-button" @click="addRelative(index)">增加家属</Button>
            <div class="form-modal-list">
              <div
                class="form-modal-relative"
                v-for="(relative, relativeIndex) in couplet.relatives"
                :key="relativeIndex"
              >
                <div class="icon-container">
                  <Icon size="20" @click="removeRelative(index, relativeIndex)" type="ios-close" />
                </div>

                <FormItem label="家属名：">
                  <Input v-model="relative.name" placeholder="名字"></Input>
                </FormItem>
                <FormItem label="关系：">
                  <Select v-model="relative.relationship">
                    <Option
                      v-for="relationship in relationshipList"
                      :key="relationship.key"
                      :value="relationship"
                    >
                      {{ relationship.title }}
                    </Option>
                  </Select>
                </FormItem>
              </div>
            </div>

            <!-- 段落一 -->
            <FormItem label="段落：">
              <Input
                v-model="couplet.passage"
                style="width: 60%"
                placeholder="例如：携全家"
              ></Input>
            </FormItem>

            <!-- 讣告预览 -->
            <div style="display: flex">
              <FormItem style="width: 300px" label="上联：">
                {{ couplet.passage }}
              </FormItem>
              <!-- 下联 -->
              <FormItem label="下联：">
                {{ couplet.passage }}
              </FormItem>
            </div>
            <!-- 上联 -->
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import select from '@/mixins/select';
import { downFontByJSON } from '@/utils/utils';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { relationships } from '@/utils/relationship.js';
import { coupletTemplates } from '@/utils/coupletTemplates.js';

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      modal: false,
      decedentTitle: '',
      selectedRelationship: null,
      decedentName: '',
      coupletList: [
        {
          index: 1,
          passage: '携全家',
          relatives: [
            {
              name: '小明',
              relationship: '儿子',
            },
          ],
        },
      ],
      relationshipList: relationships, // 引入的关系列表
      coupletTemplates: '',
      jsonFile: null,
    };
  },
  watch: {
    selectedRelationship(newVal) {
      if (!newVal) return;
      const { mainPassage } = newVal;
      this.coupletList.forEach((coupletList) => {
        coupletList.passage = mainPassage;
      });
    },
  },
  methods: {
    addRelative(index) {
      if (this.coupletList[index].relatives.length < 2) {
        this.coupletList[index].relatives.push({
          name: '',
          relationship: '',
        });
      } else {
        this.$Message.warning('最多只能添加一个家属');
      }
    },
    removeRelative(pageDataIndex, relativeIndex) {
      if (this.coupletList[pageDataIndex].relatives.length > 1) {
        this.coupletList[pageDataIndex].relatives.splice(relativeIndex, 1);
      }
    },
    addItem() {
      this.coupletList.push({ relatives: [{ key: '', title: '' }] });
    },
    removeItem(index) {
      if (this.coupletList.length > 1 || (this.coupletList.length === 1 && index > 0)) {
        this.coupletList.splice(index, 1);
      }
    },
    ok() {
      this.$Message.info('Clicked ok');
    },
    cancel() {
      this.$Message.info('Clicked cancel');
    },
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
.icon-container {
  text-align: right;
}
.modal-list {
  margin-left: 100px;
}
.form-modal-list {
  display: flex;
  align-items: center;
}
.form-modal-relative {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 15px;
  margin: 10px;
}
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
