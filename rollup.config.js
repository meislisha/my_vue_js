const babel=require('rollup-plugin-babel')
export default{
  input:'./src/index.js',
  output:{
    format:'umd',//支持amd和commonjs规范  window.vue,
    name:'Vue',
    file:'dist/vue.js',
    sourcemap:true,// es5->es6源代码
  },
  plugins:[
    babel({
      exclude:"node_modules",
    })
  ]
}