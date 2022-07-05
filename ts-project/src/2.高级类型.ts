/*
 * @Author: hidetodong
 * @Date: 2022-07-04 22:10:08
 * @LastEditTime: 2022-07-04 22:36:48
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /ts-project/src/index.ts
 * HIDETOXIC - 版权所有
 */

let base!: string | number; // 对于联合类型来说 我们可默认可以调用他的公共方法

// 1) 用的时候确定好值,后面的调用都会基于前面的赋值
// (base as number).toFixed()
// 2) 可以断言成一个已经存在的类型
// let ele = document.getElementById('root')! // !表示这个东西一定不为空
// ele.style.background
// 3) 强制类型转换
// (<HTMLElement>ele).style.background;
// 4) 联合类型
type IX = "1" | "2" | "3";
// 5) 交叉类型
type Person1 = { name: string; height: string };
type Person2 = { name: string; handsome: string };

type Person3 = Person1 | Person2

let person:Person3
let person1:Person1

// 两个类型联合后如果没有初始化则只能使用公共的部分（并集）
type Person4  = Person1 & Person2

export {};
