export let activeEffect = undefined
const targetMap = new WeakMap()

function cleanEffect(effect){
    // 需要清理effect中存入属性中的set中的effect

    // 每次执行前都需要讲effect对应的属性的set删除
    let deps = effect.deps
    for(let i = 0;i<deps.length;i++){
        deps[i].delete
    }
    effect.deps.length = 0
}

export class ReactiveEffect {
    public active = true
    public parent = undefined
    public deps = [] // effect中用了 哪些属性，后续清理使用
    constructor(public fn,public scheduler?){}
    run(){
        if(!this.active){
            return this.fn()
        }else{
            try {
                this.parent = activeEffect
                activeEffect = this
                cleanEffect(this)
                // 依赖收集 让属性和effect产生关联
               return this.fn();
            } finally{
                // 取消当前正在运行的effect
                activeEffect = this.parent;
                this.parent = null;
            }            
        }
        
    }

    stop(){
        if(this.active){
            this.active = false
            cleanEffect(this)
        }
    }
}


export function track(target,key){
    if(activeEffect){
        let depsMap = targetMap.get(target)
        // 做依赖收集
        if(!depsMap){
            targetMap.set(target,(depsMap = new Map()))
        }

        let deps = depsMap.get(key)
        if(!deps){
            depsMap.set(key,(deps = new Set()))
        }
        let shouldTrack = !deps.has(activeEffect)
        if(shouldTrack) {
            deps.add(activeEffect)
            activeEffect.deps.push(deps)
        }
    }
    // 让属性记录所用到的effect是谁 哪个effect对应了哪些属性
}

export function triggerEffects(effects) { 
    effects = new Set(effects);
    for (const effect of effects) {
        if (effect !== activeEffect) { // 如果effect不是当前正在运行的effect
            if (effect.scheduler) {
                effect.scheduler()
            } else {
                effect.run(); // 重新执行一遍
            }
        }
    }
}
export function trackEffects(dep) { // 收集dep 对应的effect
    let shouldTrack = !dep.has(activeEffect)
    if (shouldTrack) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep); 
    }
}
export function trigger(target,key,value){
    let depsMap = targetMap.get(target)
    if(!depsMap){
        return // 属性没有依赖任何的effect
    }

    let effects = depsMap.get(key)
    if(effects){
        effects =  new Set(effects)
        effects && effects.forEach(effect =>{
        // 是自己的时候就不执行
        if(effect !== activeEffect){
            if(effect.scheduler){
                effect.scheduler() // 可以提供调度函数 用户实现自己的逻辑
            }else{
                effect.run() // 数据变化了 找到对应的effect
            }
        }
        })
    }
   

}

export function effect(fn,options = {} as any) {

    const _effect = new ReactiveEffect(fn,options.scheduler)
    _effect.run()
    // 更改runner中的this ，永远为当前的effect
    const runner = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner //用户可以手动调用runner
}