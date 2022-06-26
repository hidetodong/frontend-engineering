/*
 * @Author: hidetodong
 * @Date: 2022-06-26 20:39:27
 * @LastEditTime: 2022-06-26 22:44:01
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /vite-pinia/src/stores/main.js
 * HIDETOXIC - 版权所有
 */

import { defineStore } from "../pinia";

export const useMainStore = defineStore({
    id:'main',
    state:() => {
        return {
            count:0
        }
    },
    getters:{
        double(){
            return this.count * 2;
        }
    },
    actions:{
        increment(value){
            this.count += value
        }
    }
})