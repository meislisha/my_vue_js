const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})` //  用来获取的标签名的 match后的索引为1的
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签的
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配闭合标签的
//           aa  =   "  xxx "  | '  xxxx '  | xxx
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // a=b  a="b"  a='b'
const startTagClose = /^\s*(\/?)>/ //     />   <div/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{aaaaa}}

function createAstElement(tagname, attrs) {
  return {
    tag: tagname,
    type: 1,
    children: [],
    parent: null,
    attrs
  }
}
let root = null,
  stack = []
function start(tagname, attrs) {
  let parent = stack[stack.length - 1]
  let element = createAstElement(tagname, attrs)
  if (!root) {
    root = element
  }
  element.parent = parent
  if (parent) {
    parent.children.push(element)
  }
  stack.push(element)
}
function end(tagname) {
  let last = stack.pop()
  if (last.tag !== tagname) {
    throw new Error('标签有误')
  }
}
function chars(text) {
  text = text.replace(/\s/g, '')

  let parent = stack[stack.length - 1]
  if (text) {
    parent.children.push({
      type: 3,
      text
    })
  }
}

export function parserHtml(html) {
  function advance(len) {
    html = html.substring(len)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let attr, end
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      advance(end[0].length)
      return match
    }
    return false
  }
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      const startTagMatch = parseStartTag(html)
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
      break
    }
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      chars(text)
      advance(text.length)
    }
  }
  return root
}
