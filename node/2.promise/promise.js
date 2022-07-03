/*
 * @Author: hidetodong
 * @Date: 2022-07-03 11:35:13
 * @LastEditTime: 2022-07-03 11:55:24
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /node/2.promise/promise.js
 * HIDETOXIC - 版权所有
 */

const PENDING = "PENDING";
const FULLFILLED = "FULLFILLED";
const REJECTED = "REJECTED";
class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined; // 成功的原因
    this.reason = undefined; // 失败的原因

    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    // promise 调用then的时候 可能状态依旧是pending 需要先将回调存起来
    // 等待过一会儿调用resolve时候触发

    const resolve = (value) => {
      // 只有状态是pending的时候 才可以修改状态 和改变成功和失败的原因
      if (this.status === PENDING) {
        this.status = FULLFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach((cb) => cb());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((cb) => cb());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFullfilled, onRejected) {
    // 调用then的时候已经确定的是成功还是失败
    if (this.status === FULLFILLED) {
      onFullfilled(this.value);
    }

    if (this.status === REJECTED) {
      onRejected(this.reason);
    }

    if (this.status === PENDING) {
      this.onRejectedCallbacks.push(() => {
        // TODO
        onFullfilled(this.value);
      });

      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  }
}

module.exports = Promise;
