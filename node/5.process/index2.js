Promise.resolve().then(()=>{
    console.log(0)
    return Promise.resolve(4)
}).then((res)=>{
    console.log(res)
})


Promise.resolve().then()

