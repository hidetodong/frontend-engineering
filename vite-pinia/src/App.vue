<template>
  <div @click="handleClick">{{ store.count}} / {{ store.double}}</div>
  <button @click="store.$state = {count:100}">$state修改</button>
</template>

<script setup>
import {useMainStore} from  './stores/main.js';
const store = useMainStore()
const {increment} = useMainStore()
store.$subscribe((state)=>{ //watch
  console.log('state',state)
})

store.$onAction(({ after,onError })=>{
  after((resolvedValue)=>{
    console.log(resolvedValue);
  })

  onError((error)=>{

  })
})
const handleClick = ()=>{
  increment(5)
  // store.$patch(()=>{
  //   store.count += 1
  //   store.count += 1
  //   store.count += 1
  //   store.count += 1
  // })
}
// store.$dispose()
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
