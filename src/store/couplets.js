// src/store/couplets.js
const state = {
  couplets: [
    {
      name: '示例挽联',
    },
  ],
};

const mutations = {
  addCouplet(state, couplet) {
    state.couplets.push(couplet);
  },
  setCouplet(state, couplets) {
    state.couplets = couplets;
  },
};

const actions = {
  addCouplet({ commit }, couplet) {
    commit('addCouplet', couplet);
  },
  setCouplet({ commit }, couplets) {
    commit('setCouplet', couplets);
  },
};

const coupletsModule = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default coupletsModule;
