const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{aaaaa}}
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name == 'style') {
      //color:red;fontSize:20px;
      let styleObj = {}
      attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
        styleObj[arguments[1]] = arguments[2]
      })
      attr.value = JSON.stringify(styleObj)
    }
    str += `${attr.name}:'${attr.value}',`
  }
  return str.slice(0, -1)
}
function gen(el) {
  if (el.type === 1) {
    return generate(el)
  } else {
    let tokens=[]
    //可能存在hello  {{arr}} lisha
    let text=el.text
    if(!defaultTagRE.test(text)){
      return `_v('${text}')`
    }else{
     
      let match,lastIndex=defaultTagRE.lastIndex=0;
      while(match=defaultTagRE.exec(text)){
        let index=match.index
        if(index>lastIndex){
          tokens.push(JSON.stringify(text.slice(lastIndex,index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex=index+match[0].length
      }
      if(lastIndex<text.length){
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
    }
    
    return `_v(${tokens.join('+')})`
    //
  }
}
function genChildren(el) {
  let children = el.children
  if (children) {
    return  children.map((child) => gen(child)).join(',')
    
  }
  return false
}
export function generate(el) {
  // _c('div',{id:'app',a:1},'hello')
  let code = `_c('${el.tag}',{${
    el.attrs.length ? genProps(el.attrs) : undefined
  }}${el.children ? `,${genChildren(el)}` :''})`
  return code
}
