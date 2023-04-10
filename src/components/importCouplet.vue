<template>
  <div class="p-1">
    <Divider plain orientation="left">挽联</Divider>
    <div class="flex justify-between">
      <Button size="small" type="primary" @click="showCoupletModal">新建</Button>
      <Button size="small" type="warning" @click="clearCouplets">清空</Button>
    </div>
    <div class="mt-3" v-for="(couplet, i) in list" :key="i">
      <Card>
        <template #title>{{ couplet.name }}</template>
        <div class="border shadow pl-2 pr-2 pb-1" @click="renderContent(couplet.firstContent)">
          <Divider plain orientation="center">上联</Divider>
          <div class="font-bold text-center">
            {{ couplet.firstText }}
          </div>
        </div>
        <div
          class="border shadow pl-2 pr-2 pb-1 mt-1"
          @click="renderContent(couplet.secondContent)"
        >
          <Divider plain orientation="center">下联</Divider>
          <div class="font-bold text-center">
            {{ couplet.secondText }}
          </div>
        </div>
      </Card>
    </div>
    <Modal v-model="showModal" title="创建挽联" width="800">
      <div class="mt-3" v-for="(couplet, coupletIndex) in list" :key="coupletIndex">
        <Card>
          <template #title>挽联{{ coupletIndex + 1 }}</template>
          <Form
            ref="formInline"
            v-for="(relative, relativeIndex) in couplet.relatives"
            :key="relativeIndex"
            :model="relative"
            inline
          >
            <FormItem prop="name">
              <Input
                type="text"
                v-model="relative.name"
                placeholder="亲属名称"
                @on-change="updateCouplet(couplet)"
              >
                <template #prepend>
                  <Icon type="ios-person-outline"></Icon>
                </template>
              </Input>
            </FormItem>
            <FormItem prop="relationship">
              <Select
                prefix="ios-home"
                v-model="relative.relationship"
                placeholder="亲属关系"
                @on-change="updateCouplet(couplet)"
              >
                <Option
                  v-for="relationship in relationships"
                  :key="relationship.key"
                  :value="relationship.key"
                >
                  {{ relationship.key }}
                </Option>
              </Select>
            </FormItem>
            <FormItem v-if="couplet.relatives.length <= 1">
              <Button size="small" type="success" @click="addRelative(couplet, coupletIndex)">
                新增家属
              </Button>
            </FormItem>
            <FormItem v-if="couplet.relatives.length >= 2">
              <Button size="small" type="error" @click="removeRelative(couplet, relativeIndex)">
                删除家属
              </Button>
            </FormItem>
          </Form>
          <div class="flex justify-around items-center">
            <div class="border shadow pl-2 pr-2 pb-1 w-1/2" v-if="couplet.firstText">
              <Divider plain orientation="center">上联</Divider>
              <div class="font-bold text-center">
                {{ couplet.firstText }}
              </div>
            </div>
            <div class="border shadow pl-2 pr-2 pb-1 mt-1 w-1/2" v-if="couplet.secondText">
              <Divider plain orientation="center">下联</Divider>
              <div class="font-bold text-center">
                {{ couplet.secondText }}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  </div>
</template>
<script>
import select from '@/mixins/select';
import { relationships } from '@/utils/relationship.js';
import { downFontByJSON } from '@/utils/utils';
import { coupletFirstSingleDefault, coupletSecondDefault } from '@/templates/couplet';
export default {
  name: 'ToolBar',
  mixins: [select],
  computed: {
    // 从 Vuex store 获取 list
    list() {
      return this.$store.state.couplets.couplets;
    },
    relationships() {
      return relationships;
    },
  },
  data() {
    return {
      decedentName: '欧阳覆股',
      showModal: false,
    };
  },
  methods: {
    updateCouplet(couplet) {
      var relativeNumber = 1;

      if (couplet.relatives.length == 0) {
        return;
      }

      var firstRelative = couplet.relatives[0];

      var firstRelation = this.relationships.find((x) => x.key == firstRelative.relationship);

      if (!firstRelation || !firstRelative || !firstRelative.name) {
        return;
      }

      couplet.firstText = `${firstRelation.title}${firstRelative.name}${firstRelation.mainPassage}敬挽`;
      couplet.secondText = `沉痛哀念${this.decedentName}${firstRelation.decedentTitle}千古`;

      if (couplet.relatives.length == 2) {
        var secondRelative = couplet.relatives[1];

        var secondRelation = this.relationships.find((x) => x.key == secondRelative.relationship);

        if (!secondRelation || !secondRelative || !secondRelative.name) {
          relativeNumber = 1;
        } else {
          couplet.firstText = `${firstRelation.title}${firstRelative.name},${secondRelation.title}${secondRelative.name}${firstRelation.mainPassage}敬挽`;
          relativeNumber = 2;
        }
      }

      if (relativeNumber == 1) {
        couplet.firstContent = coupletFirstSingleDefault;
        couplet.secondContent = coupletSecondDefault;
        this.replaceText(couplet.secondContent, 'decedentName', this.decedentName);
        return;
      }
    },
    replaceText(template, key, value) {
      var element = template.objects.find((x) => x.id == key);
      element.text = value;
    },
    showCoupletModal() {
      this.showModal = true;
      if (this.list.length == 0) {
        const newCouplet = {
          firstText: '',
          secondText: '',
          firstContent: null,
          secondContent: null,
          relatives: [
            {
              name: '',
              relationship: '儿子',
            },
          ],
        };
        this.$store.dispatch('couplets/addCouplet', newCouplet);
      }
    },
    addRelative(couplet) {
      if (couplet.relatives.length < 2) {
        couplet.relatives.push({
          name: '',
          relationship: '',
        });
        this.updateCouplet(couplet);
      } else {
        this.$Message.warning('最多只能添加两个家属');
      }
    },
    removeRelative(couplet, relativeIndex) {
      if (couplet.relatives.length > 1) {
        couplet.relatives.splice(relativeIndex, 1);
        this.updateCouplet(couplet);
      } else {
        this.$Message.warning('必须要有一个家属');
      }
    },
    addCouplet() {
      const newCouplet = {
        name: '示例',
        decedentName: '亲属名',
        firstText: '儿子小明携全家敬挽',
        secondText: '小花大人千古',
        firstContent: coupletFirstSingleDefault,
        secondContent: coupletSecondDefault,
      };
      this.$store.dispatch('couplets/addCouplet', newCouplet);
    },
    clearCouplets() {
      this.$store.dispatch('couplets/setCouplet', []);
    },
    // 渲染内容
    renderContent(content) {
      console.log(content);
      var json = JSON.stringify(content);
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
