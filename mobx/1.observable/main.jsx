import { observable ,autorun} from 'mobx'

let obj = { name:1 } 

// 把普通对象变成可观察对象
let proxyObj = observable(obj)

// 通过autorun可以创建一个响应
autorun(()=>{
  console.log(proxyObj.name);
})


proxyObj.name = 2
proxyObj.name = 3