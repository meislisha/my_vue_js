import { isFunction } from "./util";
import { observe } from "./observe/index";
export function initState(vm){
  const opts=vm.$options
  if(opts.data){
    initData(vm)
  }
}
function proxy(vm,source,key){
  Object.defineProperty(vm,key,{
    get(){
      return vm[source][key]
    },
    set(newVal){
       vm[source][key]=newVal
    }
  })
}
function initData(vm){
  let data=vm.$options.data
  // vue2中会将data中的所有数据进行劫持  Object.defineProperty
 data=vm._data= isFunction(data)?data.call(vm):data
 for(let key in data){
  proxy(vm,'_data',key)//做了代理，这样vm.name可以直接取到，不需要使用vm._data.names
 }
 observe(data)
}