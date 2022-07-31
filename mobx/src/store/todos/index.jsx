/*
 * @Author: hidetodong
 * @Date: 2022-07-31 21:16:03
 * @LastEditTime: 2022-07-31 21:41:49
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /mobx/src/store/todos/index.jsx
 * HIDETOXIC - 版权所有
 */

import { makeAutoObservable } from "mobx";

class TodosStore {
  list = [];
  constructor() {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }
    );
  }

  add(obj) {
    this.list.push(obj);
  }

  get unCompleteCount() {
    return this.list.filter((todo) => !todo.completed).length;
  }
}

export default new TodosStore();
