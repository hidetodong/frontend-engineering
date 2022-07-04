/*
 * @Author: hidetodong
 * @Date: 2022-07-03 11:58:44
 * @LastEditTime: 2022-07-03 11:58:45
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /node/tpl.js
 * HIDETOXIC - 版权所有
 */
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
class Promise {
  constructor(executor) {
    this.status = PENDING; // 默认是等待态
    this.value = undefined; /// 成功的原因
    this.reason = undefined; // 失败的原因

    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    // promise调用then的时候 可能状态依旧是pending，那么我们需要将回调先存放起来
    // 等待过一会调用resolve时触发 onResolvedCallbacks 执行
    // 等待调用 reject时触发onRejectedCallbacks 执行

    const resolve = (value) => {
      //只有状态是pending的时候 才可以修改状态 和 改变成功和失败的原因
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 成功调用成功的回调
        this.onResolvedCallbacks.forEach((cb) => cb());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        // 失败调用成功的回调
        this.onRejectedCallbacks.forEach((cb) => cb());
      }
    };
    //  调用executor 会自动传入 resolve 和 reject
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    // 调用then的时候 已经确定了是成功还是失败了
    if (this.status === FULFILLED) {
      // TODO..
      onFulfilled(this.value);
    }
    if (this.status === REJECTED) {
      // TODO..
      onRejected(this.reason);
    }
    if (this.status === PENDING) {
      this.onResolvedCallbacks.push(() => {
        // TODO..
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        // TODO..
        onRejected(this.reason);
      });
    }
  }
}

module.exports = Promise;

// 模块化规范 ， commonjs规范
