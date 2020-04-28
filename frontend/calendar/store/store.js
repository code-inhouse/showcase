import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
      planSettings: {},
      pane: null,  // discuss|share|addEvent|null
      settings: {
        ALLOW_PLAN_CREATION: true,
      },
      planSettingsVisible: false
    },
    getters,
    mutations,
    actions
});
