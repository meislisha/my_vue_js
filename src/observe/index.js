import {isObject} from  '../util'
import {arrayMethods} from './array'
import {Dep,pushTarget,popTarget} from './dep'
// 检测数据变化，因为class有类型，对象无类型
class Observer{
  constructor(data){
    this.dep=new Dep()
    // data._ob_=this 这样定义会导致一直是个对象，会死循环
    Object.defineProperty(data,'_ob_',{
      value:this,
      enumerable:false,//不可枚举
    })
    if(Array.isArray(data)){
      data.__proto__=arrayMethods
      this.observeArray(data)
    }else{
      //对对象的所有属性进行劫持
      this.walk(data)
    }
   
  }
  observeArray(data){
    data.forEach(item=>{
      observe(item)
    })
  }
  walk(data){
    Object.keys(data).forEach(key=>{
      defineReactive(data,key,data[key])
    })
  }
}
function dependArray(value){
  for(let i =0;i<value.length;i++){
    let current=value[i]
    current._ob_&&current._ob_.dep.depend()
    if(Array.isArray(current)){
      dependArray(current)
    }
  }
}
//定义响应式  
// vue2会对对象进行遍历  将每个属性用defineProperty重新定义，所以性能差
function defineReactive(data,key,value){
  let dep=new Dep()

let childOb=  observe(value)//如果用户默认值是对象套对象，需要递归处理（性能差）
console.log(childOb,1)
  Object.defineProperty(data,key,{
    get(){
      if(Dep.target){
        dep.depend()
        if(childOb){
          childOb.dep.depend()
          if(Array.isArray(value)){
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newVal){
      if(value!=newVal){
        value=newVal //如果用户赋值一个新对象，需要将这个对象进行劫持
        observe(newVal)
        dep.notify()
      }
    }
  })
}
export  function observe(data){
  // 如果是对象才检测
  if(!isObject(data)) return
  if(data._ob_) return data._ob_
  let observe=new Observer(data)
  return observe
}