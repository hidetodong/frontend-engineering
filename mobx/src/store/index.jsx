/*
 * @Author: hidetodong
 * @Date: 2022-07-31 21:12:30
 * @LastEditTime: 2022-07-31 21:36:32
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /mobx/src/store/index.jsx
 * HIDETOXIC - 版权所有
 */

import todosStore from "./todos";
import userStore from "./user";

const store = {
  todosStore,
  userStore,
};

export { default as TodoStore } from "./todos/todo";

export default store;
