
import { nextTick } from '../util'
const has={}
let quene=[]
let pending=false
function flushScheduleQuenu(){
  for(let i=0;i<quene.length;i++){
    quene[i].run()
  }
  pending=false
}
export function queueWatcher(watcher) {
  const id=watcher.id
  if(has[id]==null){
    quene.push(watcher)
    has[id]=true
    if(!pending){
      // setTimeout(flushScheduleQuenu, 0);
      nextTick(flushScheduleQuenu)
      pending=true
    }
  
  }
}