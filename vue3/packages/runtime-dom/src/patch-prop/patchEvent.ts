function createInvokers(preValue) {
  const invoker = (e) => {
    invoker.value(e);
  };

  invoker.value = preValue; // 后需要只需要修改value的引用 就可以达到更新
  return invoker;
}
// click ()=> fn1() -> fn2()
export function patchEvent(el, eventName, nextValue) {
  const invokers = el._vei || (el._vei = {});

  const existingInvoker = invokers[eventName];
  if (existingInvoker && nextValue) {
    existingInvoker.value = nextValue;
  } else {
    const eName = eventName.slice(2).toLowerCase();

    if (!nextValue) {
      // 不存在缓存的情况 addEventListener
      const invoker = createInvokers(nextValue);
      el.addEventListener(eName, invoker);
      invokers[eventName] = invoker;
    } else if (existingInvoker) {
      // 没有新的值 但是之前绑定过 需要删除
      el.removeEventListener(eName, existingInvoker);
      invokers[eventName] = null;
    }
  }
}
