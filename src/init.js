import {
  initState
} from './state'
import {compileToFunction} from './compiler/index'
import {mountComponent} from './lifecycle'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options //后面会对options进行扩展操作

    // 对数据进行初始化 watch computed props data ...
    initState(vm) //vm.$options.data

    if (options.el) {
      vm.$mount(options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el)
    const vm = this
    vm.$el=el;
    const options = vm.$options
    if (!options.render) {
     let template = options.template
      if (!template && el) {
        template = el.outerHTML
        let render = compileToFunction(template)
        options.render = render
      }

    }
    mountComponent(vm,el)
  }
}