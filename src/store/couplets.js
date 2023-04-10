const state = {
  couplets: [],
};

const mutations = {
  addCouplet(state, couplet) {
    state.couplets.push(couplet);
  },
  setCouplet(state, couplets) {
    state.couplets = couplets;
  },
  updateCouplet(state, { index, updatedCouplet }) {
    console.log('update', updatedCouplet);
    state.couplets.splice(index, 1, updatedCouplet);
  },
};

const actions = {
  addCouplet({ commit }, couplet) {
    commit('addCouplet', couplet);
  },
  setCouplet({ commit }, couplets) {
    commit('setCouplet', couplets);
  },
  updateCouplet({ commit }, { index, updatedCouplet }) {
    commit('updateCouplet', { index, updatedCouplet });
  },
};

const coupletsModule = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default coupletsModule;
