import {pushTarget,popTarget} from './dep'
import {queueWatcher} from './scheduler'
let id=0;
class Wacther{
  constructor(vm,expOfFn,cb,options){
    this.depsId=new Set()
    this.deps = []; 
    this.vm=vm;
    this.expOfFn=expOfFn;
    this.cb=cb;
    this.options=options;
this.id=id++;

    //默认要执行一遍

    this.getter=expOfFn
    this.get()
    
  }
  addDep(dep){
    let id=dep.id
    if(!this.depsId.has(id)){
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  get(){
    pushTarget(this)
    this.getter()
    popTarget()
  }
  update(){
    // console.log(this)
    // this.get()
    queueWatcher(this); 
  }
  run(){
    console.log(this)
    this.get()
  }
}
export default Wacther