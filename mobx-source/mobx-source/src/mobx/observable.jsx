/*
 * @Author: hidetodong
 * @Date: 2022-08-07 12:21:54
 * @LastEditTime: 2022-08-07 12:24:56
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /mobx-source/src/mobx/observable.js
 * HIDETOXIC - 版权所有
 */
import { isObject } from "./utils";
import { object } from "./observableObject";

function observable(v) {
  if (isObject) {
    return object(v);
  }
}

export default observable;
