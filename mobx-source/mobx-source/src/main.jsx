import { observable, autorun } from "./mobx";

let obj = { name: 1, age: 231 };

let proxyObj = observable(obj);

autorun(() => {
  console.log(proxyObj.age);
});

proxyObj.age = 123132;
