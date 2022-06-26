/*
 * @Author: hidetodong
 * @Date: 2022-06-26 21:31:41
 * @LastEditTime: 2022-06-26 22:50:24
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /vite-pinia/src/pinia/store.js
 * HIDETOXIC - 版权所有
 */
import {
  getCurrentInstance,
  inject,
  effectScope,
  reactive,
  computed,
  toRefs,
} from "vue";
import { symbolPinia } from "./consts";
// let pinia = inject (symbolPinia)
// state 管理store中的state
// _s store和对应的id映射
//_e 用于停止effect

function createSetupStore(id, setup, pinia) {
  let scope;

  // 全局可以关闭所有的store
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });

  const store = reactive({}); // 这里可以扩展自己的方法

  pinia._s.set(id, store);

  function wrapAction(action) {
    return function (...args) {
      // todo ..
      return action.call(store, ...args);
    };
  }

  for (let key in setupStore) {
    const v = setupStore[key];
    if (typeof v === "function") {
      setupStore[key] = wrapAction(v);
    }
  }

  Object.assign(store, setupStore);
}

function createOptionsStore(id, options, pinia) {
  let { state, actions, getters } = options;
  function setup() {
    pinia.state.value[id] = state ? state() : {};
    const localState = toRefs(pinia.state.value[id]);
    return Object.assign(
      localState,
      actions,
      Object.keys(getters || {}).reduce((memo, key) => {
        memo[key] = computed(() => {
          const store = pinia._s.get(id);
          return getters[key].call(store, store);
        });
        return memo;
      }, {})
    );
  }
  createSetupStore(id, setup, pinia);
}

export function defineStore(idOrOptions, setup) {
  // id + 对象格式
  // 对象
  let id;
  let options;
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  const isSetupStore = typeof setup === "function";

  // 用户使用的函数
  function useStore() {
    const currentInstance = getCurrentInstance();
    const pinia = currentInstance && inject(symbolPinia);
    console.log(pinia);
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, pinia);
      } else {
        // 将标识和选项放到pinia里
        createOptionsStore(id, options, pinia);
      }
    }

    const store = pinia._s.get(id);
    // 只有第一次是创建 后续都是复用
    return store;
  }

  return useStore;
}
