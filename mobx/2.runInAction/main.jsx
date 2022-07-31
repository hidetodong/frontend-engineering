import { reaction } from "mobx";
import { runInAction } from "mobx";
import { when } from "mobx";
import { makeAutoObservable } from "mobx";
import {
  observable,
  autorun,
  makeObservable,
  computed,
  action,
  flow,
} from "mobx";

class Doubler {
  value;
  constructor(value) {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );
    this.value = value;
  }

  get double() {
    return this.value * 2;
  }
  // action 有很多好处
  // 1.action内部会使用事务的机制
  // 2.只在action中执行修改，好排查
  add() {
    this.value++;
    this.value++;
  }

  *fetch() {
    // redux-saga
    const response = yield new Promise((resolve) =>
      setTimeout(() => resolve(5), 1000)
    );
    this.value = response;
  }
}

let doubler = new Doubler(1);

// 不会立刻执行，只会在值发生改变后才执行
reaction(
  () => doubler.value, // data函数
  (value, prevValue) => {
    console.log(value, prevValue);
  }
);

// let disposer = when(()=>doubler.value > 3,()=>{
//   console.log(123123)
// })
// disposer()// 一旦执行里when返回的方法，表示取消等待 删除响应


runInAction(()=>{
  doubler.value++
  doubler.value++
  doubler.value++
  doubler.value++
  doubler.value++
})