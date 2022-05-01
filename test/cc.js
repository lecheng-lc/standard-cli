module.exports = {
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    entry: {
      app: './src/main.ts'
    },
    resolve: { extensions: ['.ts', '.tsx', '.js', '.json', '.vue'] },
    module: {
      rules: [
       
      ]
    }
  }
}
