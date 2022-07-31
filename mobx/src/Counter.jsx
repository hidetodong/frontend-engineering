/*
 * @Author: hidetodong
 * @Date: 2022-07-31 20:53:47
 * @LastEditTime: 2022-07-31 21:08:38
 * @LastEditors: hidetodong
 * @Description:
 * @FilePath: /mobx/src/Counter.jsx
 * HIDETOXIC - 版权所有
 */

import { makeAutoObservable } from "mobx";
import { useObserver,useLocalObservable } from "mobx-react";
import { observer, Observer } from "mobx-react";
import React from "react";

class Store {
  number = 1;
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
  add() {
    this.number++;
  }
}

let store = new Store();

// observer装饰的是整个组件

// @observer
// export default class Counter extends React.Component{
//     render(){
//         return (
//             <div>
//                 <p>{store.number}</p>
//                 <button onClick={(store.add)}>+</button>
//             </div>
//         )
//     }
// }

function Child() {
  console.log("render child");
  return <div>Child</div>;
}

// export default function () {
//   return (
//     <div>
//       <Child />
//       <Observer>
//         {() => (
//           <>
//             <p>{store.number}</p>
//             <button onClick={store.add}>+</button>
//           </>
//         )}
//       </Observer>
//     </div>
//   );
// }

// export default function () {
//   return useObserver(() => (
//     <>
//       <p>{store.number}</p>
//       <button onClick={store.add}>+</button>
//     </>
//   ));
// }
export default function () {
    const store = useLocalObservable(()=>({
        number:1,
        add(){
            this.number++
        }
    }))
  return useObserver(() => (
    <>
      <p>{store.number}</p>
      <button onClick={store.add}>+</button>
    </>
  ));
}
