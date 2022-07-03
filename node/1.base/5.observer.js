/*
 * @Author: hidetodong
 * @Date: 2022-07-03 10:50:21
 * @LastEditTime: 2022-07-03 10:58:29
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /node/5.observer.js
 * HIDETOXIC - 版权所有
 */


class Subject { // 被观察者
    constructor(name){
        this.name = name
        this._arr = [];
        this.state = 'happy'
    }
    attach(o){
        this._arr.push(o)
    }

    setState(newState){
        this.state = newState
        this._arr.forEach(o=>{
            o?.update(this.state)
        })
    }

}

class Observer { // 观察者
    constructor(name){
        this.name = name
    }
    update(s){
        console.log(this.name,s)
    }
}

let s = new Subject('babe'); // 创建一个被观察对象

let o1 = new Observer('papa');
let o2 = new Observer('mama');
s.attach(o1)
s.attach(o2)

s.setState('cry');

// 让o1 o2 绑定到s上


// 观察者模式 是基于发布订阅的 主动的 状态变化 主动通知