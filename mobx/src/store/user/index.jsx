/*
 * @Author: hidetodong
 * @Date: 2022-07-31 21:16:06
 * @LastEditTime: 2022-07-31 21:18:16
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /mobx/src/store/user/index.jsx
 * HIDETOXIC - 版权所有
 */


import { makeAutoObservable } from 'mobx'


class UserStore {
    username = ''

    constructor(){
        makeAutoObservable(this,{},{
            autoBind:true
        })
    }

    get isLogin (){
        return this.username.length > 0
    }

    login(username){
        this.username=username
    }

    logout(){
        this.username = ''
    }
}

export default new UserStore()