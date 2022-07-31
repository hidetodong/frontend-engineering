/*
 * @Author: hidetodong
 * @Date: 2022-07-31 21:30:15
 * @LastEditTime: 2022-07-31 21:30:15
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /mobx/src/store/todos/todo.jsx
 * HIDETOXIC - 版权所有
 */

/*
 * @Author: hidetodong
 * @Date: 2022-07-31 21:16:03
 * @LastEditTime: 2022-07-31 21:27:44
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /mobx/src/store/todos/index.jsx
 * HIDETOXIC - 版权所有
 */

import { makeAutoObservable } from "mobx";

class TodoStore {
  text = "";
  completed = false;
  constructor(text) {
    makeAutoObservable(
      this,
      {},
      {
        autoBind: true,
      }

    );
    this.text = text
  }

  toggle() {
    this.completed = !this.completed;
  }
}

export default TodoStore;
