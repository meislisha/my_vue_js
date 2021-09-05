
import {patch} from './vdom/patch'
import Wacther from './observe/watcher'
import {nextTick} from './util'
export function lifecycleMixin(Vue){
  Vue.prototype._update=function(vnode){
   const vm=this
   console.log(vm)
   vm.$el= patch(vm.$el,vnode)//新节点替换就节点
  }
  Vue.prototype.$nextTick = nextTick
}
export function mountComponent(vm,el){
  //更新函数 数据变化后，会再次调用此函数
  let updateComponent=()=>{
    //调用render生成虚拟dom
    vm._update(vm._render()) //后续更新可以调用updateComponent方法
    //虚拟dom生成真是dom
  }
  // 观察者模式
  // updateComponent()
  new Wacther(vm,updateComponent,function(){
    console.log('更新视图')
  },true)
}