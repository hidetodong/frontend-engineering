/*
 * @Author: hidetodong
 * @Date: 2022-06-26 21:31:41
 * @LastEditTime: 2022-06-27 08:36:57
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
  watch
} from "vue";
import { symbolPinia } from "./consts";
import { addSubscription } from './subscription'

// let pinia = inject (symbolPinia)
// state 管理store中的state
// _s store和对应的id映射
//_e 用于停止effect

function isObject(value) {
  return typeof value === "object" && value !== null
}

function merge(target, state) {
  for (let key in state) {
    target[key] = state[key]
    let oldValue = target[key]
    let newValue = state[key]
    if (isObject(oldValue) && isObject(newValue)) {
      target[key] = merge(oldValue, newValue)
    } else {
      target[key] = state[key]
    }
  }
}

function createSetupStore(id, setup, pinia) {
  let scope;

  // 全局可以关闭所有的store
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });

  function $patch(partialStateOrMutator) {
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[id])
    } else {
      merge(pinia.state.value[id], partialStateOrMutator)
    }
  }

  const actionSubscription = []

  const store = reactive({
    $patch,
    $subscribe(callback, options) {
      scope.run(() => {

        watch(pinia.state.value[id], (state) => {
          callback(state)
        }, options)
      })
    },
    /** 绑定数组和用户的回调 */
    $onAction:addSubscription.bind(null,actionSubscription)
  }); // 这里可以扩展自己的方法

  pinia._s.set(id, store);

  function wrapAction(action) {
    return function (...args) {
      // todo ..
      console.log('actionSubscription',actionSubscription)
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

  // if(!pinia.state.value[id]){
  //   pinia.state.value[id] = {}
  // }

  return store
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
  const store = createSetupStore(id, setup, pinia);
  store.$reset = function () {
    const newState = state ? state() : {};
    store.$patch((state) => {
      Object.assign(state, newState)
    })
  }
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
