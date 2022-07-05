// 什么是接口 用来描述数据形状的
// 1) type可以用联合类型。interface不可以
// 2）type可以别名 不能被拓展 继承 interface可以继承
// 3）type可以做循环和条件判断 interface不行

interface IVegetable {
  color: string;
  taste: string;
}

let v: IVegetable = {
  color: "sdf",
  taste: "sdff",
};

// 1） ts兼容性 接口中要求的属性用就可以 多的不管
let temp = {
  color: "12",
  taste: "3123",
  size: "1231",
};

v = temp;

// 2）断言的方式
let v2: IVegetable = {
  color: "sf",
  taste: "123",
  size: "231",
} as IVegetable;

// 3） 接口的合并 可以创造一个合并后的结果 开发中不推荐
// interface IVegetable

// 4) 接口的方式实现
interface IFruit {
  // readonly
  readonly color: string;
  a?: number;
  type: () => "abc";
  [xxx: number]: any;
}

//  ----------- 函数类型 ------------- //
// 想描述函数和函数上的属性 （混合接口）

interface IFn {
  (): number;
  count: number;
}

const fn: IFn = function () {
  return fn.count++;
};
fn.count = 0;

// 接口米哦啊叔累的静态属性和方法 和实例的属性和方法
// 非常像抽象类

interface ISpeakEnglish {
  speakEnglish(): void;
}

interface ISpeakChinese {
  speakChinese(): void;
}

class Person implements ISpeakChinese, ISpeakEnglish {
  // speakChinese!: () => void
  // speakEnglish!: () => void
  speakChinese(): void {}
  speakEnglish(): void {}
}

// 类也是类型 接口可以继承类型

interface X extends Person {
  // 可以通过已有的类 来实现类型拓展
}

// 接口能用来描述类
// 对象 函数 类 类的实例（构造函数）
class Son {}

interface IClazz {
  new (...args: any[]): any;
}

function getInstance<T>(clas: IClazz) {
  // 类类型是用来描述实例的 不是用来描述类的
  return new clas();
}

getInstance(Son);

// 希望在使用的时候再确定类型 =》 泛型

interface ICreateArray { // 接口后面放泛型意味着使用接口的时候传递 
  <T>(times: number, content: T): T[]; // 放到函数前面意味着调用函数的时候传递类型
}
// 泛型的使用位置 创建数组 3 string 3 number
const createArray: ICreateArray = <T>(times: number, content: T) => {
  let arr = [];
  for (let i = 0; i < times; i++) {
    arr.push(content);
  }
  return arr
};
interface ICallback<T> {
    (item:T):void
}
function forEach<T>(arr:T[],callback:ICallback<T>){

}

forEach([1,2,3,4,5],function (item){})

let arr = createArray(3, "he");
console.log(arr);

export {};
