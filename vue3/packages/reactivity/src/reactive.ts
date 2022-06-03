import { isObject } from "@vue/shared";
import { track } from "./effect";
const reactiveMap = new WeakMap(); // key必须是对象 弱引用
import { ReactiveFlags, baseHandler } from "./baseHandler";
export function reactive(target) {
  if (!isObject(target)) {
    return target;
  }

  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  // 获取缓存
  const existing = reactiveMap.get(target);
  if (existing) return existing;

  // es6 proxy
  const proxy = new Proxy(target, baseHandler);

  return proxy;
}

// 去proxy上取aliasName 会执行get方法
// 但是aliasName 是基于name属性 原则上应该取name上取值
// 然而this.aliasName 没有触发proxy的get 也就意味着修改name不会触发响应
