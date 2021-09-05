let oldArrayPrototype=Array.prototype
export let arrayMethods=Object.create(oldArrayPrototype)
  let methods=[
    'push',
    'pop',
    'splice',
    'unshift',
    'shift',
    'reverse',
    'sort',
  ]
  methods.forEach(method=>{
    arrayMethods[method]=function(...args){
      console.log(...args,8989)
      oldArrayPrototype[method].call(this,...args)
      let inserted
      switch(methods){
        case 'push':
          case 'unshift':
            inserted=args
            break
            case 'splice':
              inserted=args.splice(2)
          break
        default:
          break;
      }
  if(inserted)    this._ob_.observeArray(inserted)
  console.log(99)
  this._ob_.dep.notify()
    }
  })