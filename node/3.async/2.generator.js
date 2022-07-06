function* read() { // 表示是一个generator函数 可以将函数切成若干个部分
    const a = yield 1;
    console.log('a',a)
    const b = yield 2;
    console.log('b',b)
    const c = yield 3;
    console.log('c',c)
}
let it = read()

// 方法碰到yield就停止
console.log('it.next()',it.next())
console.log('it.next()',it.next('a')) // 调用next方法就是调用参数 就是给上一次yield的返回值赋值
console.log('it.next()',it.next())
console.log('it.next()',it.next())



// Symbol 可以进行元编程

// console.log(read())

// console.log(Array.from({0:1,1:2,2:3,length:3})) // 可以

// console.log([...{0:1,1:2,2:3,length:3}]) //报错 不能被迭代

// console.log([...{ 0: 1, 1: 2, 2: 3, length: 3,
//     // [Symbol.iterator]: function () {
//     //     let arr = this
//     //     let index = 0
//     //     return {
//     //         next() {
//     //             this // 指向这个对象
//     //             if (--arr.length === 0) {
//     //                 return { value: arr[index], done: index++ == arr.length }
//     //             }
//     //         }
//     //     }
//     // },
//     [Symbol.iterator]: function* () {
//         let index = 0
//         console.log(index, this.length)
//         while (index !== this.length) {
//             yield this[index++];
//         }
//     }
// }])

// 迭代器 有一个next方法 能去return value和done状态

 