// src/store/menu.ts
import { defineStore } from 'pinia';

export const useMenuStore = defineStore({
  id: 'menu',
  state: () => ({
    activeMenuItem: 'myTemplates',
  }),
  actions: {
    setActiveMenuItem(item: string) {
      this.activeMenuItem = item;
    },
  },
});
