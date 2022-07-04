/*
 * @Author: hidetodong
 * @Date: 2022-07-03 11:58:44
 * @LastEditTime: 2022-07-03 16:48:21
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /node/2.promise/promise.js
 * HIDETOXIC - 版权所有
 */
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

function resolvePromise(promise2, x, resolve, reject) {
  // 这个方法处理比较严谨 保证所有人的promise都可以互相调用
  // x是一个promise 而且永远不会成功或者失败 就会等待

  if (x === promise2) {
    return reject(new TypeError("出错了"));
  }

  // 如何知道x是不是promise
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    // 有可能是promise
    try {
      let called = false;
      let then = x.then; // 取值的时候 then方法可能是通过defineProperty来定义的
      if (typeof then === "function") {
        // 就是一个对象或者函数
        then.call(
          x,
          (y) => {
            // 为了防止解析后还是promise 所以要递归解析
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            // x.then
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x); // 普通值 直接将结果传递到下面
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x); // 普通值 直接将结果传递到下面
  }
}
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
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
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
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e;
          };
    let promise2 = new Promise((resolve, reject) => {
      // 调用then的时候 已经确定了是成功还是失败了
      if (this.status === FULFILLED) {
        // TODO..

        setTimeout(() => {
          try {
            const data = onFulfilled(this.value);
            resolvePromise(promise2, data, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === REJECTED) {
        // TODO..
        setTimeout(() => {
          try {
            const err = onRejected(this.reason);
            resolvePromise(promise2, err, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          // TODO..
          setTimeout(() => {
            try {
              const data = onFulfilled(this.value);
              resolvePromise(promise2, data, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          // TODO..
          setTimeout(() => {
            try {
              const err = onRejected(this.reason);
              resolvePromise(promise2, err, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }

  catch(errCallback) {
    return this.then(null, errCallback);
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
  static all(values) {
    let results = [];
    let count = 0;
    function processData(i, data, resolve) {
      results[i] = data;
      if (++count === values.length) {
        resolve(results);
      }
    }
    return new Promise((resolve, reject) => {
      // 并发是循环 串行是递归
      for (let i = 0; i < values.length; i++) {
        let cur = values[i];
        Promise.resolve(cur).then((data) => {
          processData(i, data);
        }, reject);
      }
    });
  }

  static race(values){
    let result
    return new Promise((resolve, reject) => {
        // 并发是循环 串行是递归
      for (let i = 0; i < values.length; i++) {
        let cur = values[i];
        Promise.resolve(cur).then(resolve, reject);
      }
    })
  }
}

module.exports = Promise;

Promise.deferred = function () {
  let obj = {};
  obj.promise = new Promise((resolve, reject) => {
    obj.resolve = resolve;
    obj.reject = reject;
  });
  return obj;
};

// 模块化规范 ， commonjs规范
