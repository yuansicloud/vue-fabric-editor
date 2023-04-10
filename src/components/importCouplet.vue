<template>
  <div class="p-1">
    <Divider plain orientation="left">挽联 {{ this.decedentName }}</Divider>
    <div class="flex justify-between">
      <Button
        size="small"
        :type="list.length > 0 ? 'warning' : 'success'"
        @click="showCoupletModal"
      >
        {{ list.length > 0 ? '管理' : '新建' }}
      </Button>
      <Dropdown style="margin-left: 20px">
        <Button size="small" type="primary">
          菜单
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <template #list>
          <DropdownMenu>
            <DropdownItem @click="saveToCouplet">
              <Button :disabled="selectedIndex == -1" type="primary" ghost>保存当前</Button>
            </DropdownItem>
            <DropdownItem @click="printCouplet">
              <Button :disabled="list.length == 0" type="info" ghost>打印挽联</Button>
            </DropdownItem>
            <DropdownItem @click="downloadCouplet">
              <Button :disabled="list.length == 0" type="warning" ghost>下载挽联</Button>
            </DropdownItem>
            <DropdownItem @click="clearCouplets">
              <Button :disabled="list.length == 0" type="error" ghost>清空全部</Button>
            </DropdownItem>
          </DropdownMenu>
        </template>
      </Dropdown>
    </div>
    <div
      class="mt-3"
      :class="
        coupletIndex == selectedIndex ? 'border border-green-500 border-dotted border-3 shadow' : ''
      "
      v-for="(couplet, coupletIndex) in list"
      :key="coupletIndex"
    >
      <Card>
        <template #title>
          <div>挽联{{ coupletIndex + 1 }}</div>
        </template>
        <div
          class="shadow pl-2 pr-2 pb-1 rounded"
          :class="
            coupletIndex == selectedIndex && selectedType == 'first'
              ? 'border border-blue-500 border-2'
              : ''
          "
          @click="renderContent(couplet.firstContent, coupletIndex, 'first')"
          v-if="couplet.firstText"
        >
          <Divider plain orientation="center">上联</Divider>
          <div class="font-bold text-center">
            {{ couplet.firstText }}
          </div>
        </div>
        <div
          class="shadow pl-2 pr-2 pb-1 mt-1 rounded"
          :class="
            coupletIndex == selectedIndex && selectedType == 'second'
              ? 'border border-blue-500 border-2'
              : ''
          "
          @click="renderContent(couplet.secondContent, coupletIndex, 'second')"
          v-if="couplet.secondText"
        >
          <Divider plain orientation="center">下联</Divider>
          <div class="font-bold text-center">
            {{ couplet.secondText }}
          </div>
        </div>
        <div class="font-bold pl-2 pr-2 pb-1 mt-1 text-yellow-500" v-else>请先添加挽联内容</div>
      </Card>
    </div>
    <Modal v-model="showModal" title="创建挽联" width="800">
      <div class="flex justify-between">
        <div class="flex items-center font-bold">
          <div>逝者名称：</div>
          <Input
            type="text"
            v-model="decedentName"
            placeholder="逝者名称"
            style="width: auto"
            @on-change="updateCouplets()"
          >
            <template #prepend>
              <Icon type="ios-person-outline"></Icon>
            </template>
          </Input>
        </div>
        <Button :disabled="!decedentName" type="primary" @click="addCouplet">新增挽联</Button>
      </div>

      <div class="mt-3" v-for="(couplet, coupletIndex) in list" :key="coupletIndex">
        <Card>
          <template #title>
            <div class="flex justify-between items-center">
              <div>挽联{{ coupletIndex + 1 }}</div>
              <Button size="small" type="error" @click="removeCouplet(coupletIndex)">删除</Button>
            </div>
          </template>
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
import { v4 as uuid } from 'uuid';
import axios from 'axios';
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
      selectedIndex: -1,
      selectedType: '',
      decedentName: '',
      showModal: false,
      showSavingModal: false,
      autoSave: false,
    };
  },
  methods: {
    updateCouplets() {
      // Access the couplets list from the Vuex store
      const coupletsList = this.$store.state.couplets.couplets;

      // Iterate over the couplets list
      coupletsList.forEach((couplet, index) => {
        // Process each couplet and its index here
        this.updateCouplet(couplet);
      });
    },
    updateCouplet(couplet) {
      if (!this.decedentName) {
        return;
      }

      var relativeNumber = 1;

      if (!couplet.relatives || couplet.relatives.length == 0) {
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
      // if (this.list.length == 0) {
      //   const newCouplet = {
      //     firstText: '',
      //     secondText: '',
      //     firstContent: null,
      //     secondContent: null,
      //     relatives: [
      //       {
      //         name: '',
      //         relationship: '儿子',
      //       },
      //     ],
      //   };
      //   this.$store.dispatch('couplets/addCouplet', newCouplet);
      // }
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
    removeCouplet(coupletIndex) {
      this.list.splice(coupletIndex, 1);
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
        decedentName: this.decedentName,
        firstText: '',
        secondText: '',
        firstContent: null,
        secondContent: null,
        relatives: [
          {
            name: '',
            relationship: '',
          },
        ],
      };
      this.$store.dispatch('couplets/addCouplet', newCouplet);
    },
    clearCouplets() {
      this.selectedIndex = -1;
      this.selectedType = '';
      this.$store.dispatch('couplets/setCouplet', []);
    },
    // 渲染内容
    renderContent(content, newIndex, newType) {
      this.checkSaving(newIndex, newType);
      this.selectedIndex = newIndex;
      this.selectedType = newType;
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
    checkSaving(newIndex, newType) {
      if (this.selectedIndex == -1 && !this.selectedType) return;
      if (this.selectedIndex == newIndex && this.selectedType == newType) return;
      this.saveToCouplet();
    },
    saveToCouplet() {
      this.$Message.success({
        content: '正在保存当前挽联...',
        duration: 2,
      });

      const dataUrl = this.canvas.editor.getJson();
      switch (this.selectedType) {
        case 'first':
          this.list[this.selectedIndex].firstContent = dataUrl;
          break;
        case 'second':
          this.list[this.selectedIndex].secondContent = dataUrl;
          break;
        default:
          this.$Message.warning('保存失败！');
          break;
      }
    },
    downFile(fileStr, fileType) {
      const anchorEl = document.createElement('a');
      anchorEl.href = fileStr;
      anchorEl.download = `${uuid()}.${fileType}`;
      document.body.appendChild(anchorEl); // required for firefox
      anchorEl.click();
      anchorEl.remove();
    },
    getDataUrl() {
      const workspace = this.canvas.c.getObjects().find((item) => item.id === 'workspace');
      this.canvas.editor.ruler.hideGuideline();
      const { left, top, width, height } = workspace;
      const option = {
        name: 'New Image',
        format: 'png',
        quality: 1,
        left,
        top,
        width,
        height,
      };
      this.canvas.c.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = this.canvas.c.toDataURL(option);
      this.canvas.editor.ruler.showGuideline();
      return dataUrl;
    },
    async downloadCouplet() {
      this.downFile(this.getDataUrl(), 'png');
    },
    async printCouplet() {
      // const getTemp = await axios.get('http://192.168.1.48:5000/printer');
      try {
        const response = await axios.post('http://192.168.1.48:5000/printer', {
          ImageDataUrl: this.getDataUrl(),
        });
        console.log('Image data sent to backend successfully:', response.data);
      } catch (error) {
        console.error('Failed to send image data to backend:', error);
      }
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
