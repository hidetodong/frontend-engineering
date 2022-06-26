/*
 * @Author: hidetodong
 * @Date: 2022-06-26 21:30:48
 * @LastEditTime: 2022-06-26 22:09:46
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /vite-pinia/src/pinia/createPinia.js
 * HIDETOXIC - 版权所有
 */

import { effectScope ,ref} from "vue";
import { symbolPinia } from './consts'
export function createPinia (){
    const scope = effectScope();
    const state = scope.run(()=> ref({}))

    const pinia = {
        install(app){
            app.provide(symbolPinia,pinia)
        },
        state,
        _s:new Map(),
        _e:scope,
        scope
    }

    return pinia
}