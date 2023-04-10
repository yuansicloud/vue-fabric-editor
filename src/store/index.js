import { createStore } from 'vuex';
import coupletsModule from './couplets';
const store = createStore({
  modules: {
    couplets: coupletsModule,
  },
});
export default store;
