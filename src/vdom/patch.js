export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType === 1) {
    //真实元素
    let parentElm = oldVnode.parentNode
    let elm = createElm(vnode)
    parentElm.insertBefore(elm, oldVnode.nextSibling)
    parentElm.removeChild(oldVnode)
    return elm
  }
}
function createElm(vnode) {
  let {tag,data,children,text,vm}=vnode
  if(typeof vnode.tag ==='string'){
    //是元素
    vnode.el=document.createElement(vnode.tag)
    //虚拟节点会有一个el属性，对应真是节点

    children.forEach(child=>{
      vnode.el.append(createElm(child))
    })
  }else{
    vnode.el=document.createTextNode(text)
  }
  return vnode.el
}
