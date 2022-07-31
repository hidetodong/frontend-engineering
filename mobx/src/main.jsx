import { autorun } from "mobx";
import { observable } from "mobx";

let obj = { name: 1 };
const proxyObj = observable(obj);

autorun(() => {
  console.log(proxyObj.name);
});

proxyObj.name = 2;
