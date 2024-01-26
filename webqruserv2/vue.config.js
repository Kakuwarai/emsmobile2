
// module.exports = {
//   publicPath: process.env.NODE_ENV === 'production'
//     ? './'
//     : './'
// }

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
})


// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   publicPath: '/',
//   lintOnSave: false,
//   runtimeCompiler: true
// })