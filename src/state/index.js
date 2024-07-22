import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      user: {},
      roles: [],
      permissions: []
    };
  },
  mutations: {
    setUser(state,user) {
      state.user = user;
    },
    setRoles(state,roles) {
      state.roles = roles;
    },
    setPermissions(state,permissions) {
      state.permissions = permissions;
    },
  },
});

export default store;
