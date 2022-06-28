export function addSubscription(subscription,callback) {
    subscription.push(callback)   

    const removeSubscription = ()=>{
        let idx = subscription.indexOf(callback)
        if(idx > -1){
            subscription.splice(idx,1)
        }
    }

    return removeSubscription
}


export function triggerSubscription(subscription,...args) {
    console.log('args',args)
    /**  */
    subscription.slice(0).forEach(subscribe=>subscribe(...args))
}