const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack:function anonymous(config){
    config.entry.app = './src/main.ts'
    config.module.rules.push(
      {
        test: /\.tsx?$/,
        use:[
          {
            loader:'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              happyPackMode: false,
              transpileOnly: true,
            }
          },
        ]
      }
    )
  },
})
