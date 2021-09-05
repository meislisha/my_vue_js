export function isFunction(val){
  return typeof val ==='function'
}
export function isObject(val){
  return typeof val ==='object' && typeof val !=='null'
}
let wating=false
let nextTickArr=[]
function flushCallback(){
  nextTickArr.forEach(CB=>CB())
  wating=false
}
function timer(flushCallback){
  let timeFn=()=>{}
  if(Promise){
    timeFn=()=>{
      Promise.resolve().then(flushCallback)
    }
  }else if(MutationObserver){
    let textNode=document.createTextNode(1)
    let observe=new MutationObserver(flushCallback)
    observe.observe(textNode,{
      characterData:true
    })
    timeFn=()=>{
      textNode.textContent=3
    }
  }else if(setImmediate){
    timeFn=()=>{
      setImmediate(flushCallback)
    }
  }else{
    timeFn=()=>{
      setTimeout(flushCallback, 0)
    }
  }
  timeFn()
}
export function nextTick(cb){
  nextTickArr.push(cb)
  if(!wating){
    // setTimeout(flushCallback,0)
    timer(flushCallback)
    wating=true
  }
}