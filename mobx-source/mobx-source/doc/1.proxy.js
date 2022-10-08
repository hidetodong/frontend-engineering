let obj = { name: 1 };
let proxyObj = new Proxy(obj, {
  get(target, key) {
    console.log(target, key);
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    console.log(target, key, value);
    return Reflect.set(target, key, value);
  },
});
console.log(proxyObj.name);
proxyObj.name = 1123;
