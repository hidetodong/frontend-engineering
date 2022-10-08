/*
 * @Author: hidetodong
 * @Date: 2022-08-07 13:22:39
 * @LastEditTime: 2022-08-07 13:33:35
 * @LastEditors: hidetodong
 * @Description: 
 * @FilePath: /mobx-source/src/mobx/autorun.jsx
 * HIDETOXIC - 版权所有
 */

import { getNextId } from "./utils"
import Reaction from './reaction'

function autorun(view) {
    const name = 'Autorun@'+getNextId();
    const reaction = new Reaction(
        name,
        function(){
            this.track(view)
        }
    )
    reaction.schedule();
}

export default autorun