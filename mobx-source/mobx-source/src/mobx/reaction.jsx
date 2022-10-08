/*
 * @Author: hidetodong
 * @Date: 2022-08-07 13:24:38
 * @LastEditTime: 2022-08-07 13:46:22
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /mobx-source/src/mobx/reaction.jsx
 * HIDETOXIC - 版权所有
 */
import { globalState } from './utils'

export default class Reaction {
    constructor(name,onInvalidate){
        this.name = name 
        this.onInvalidate = onInvalidate
        this.observing = [] // 表示他观察到了哪些可观察变量
    }
    schedule(){
        globalState.pendingReactions.push(this)
        runReactions()
    }
    runReaction(){
        this.onInvalidate()
    }

    track(fn){ // Derivation = reaction 
        globalState.trackingDerivation = this
        fn.call()
        globalState.trackingDerivation = null
        bindDerivations(this)
    }
}

function bindDerivations(derivation){
    const { observing } = derivation
    observing.forEach(observableValue=>{
        observableValue.observers.add(derivation)
    })
}

function runReactions (){
    const allReactions = globalState.pendingReactions;
    let reaction
    while(reaction = allReactions.shift()){
        reaction.runReaction()
    }
}