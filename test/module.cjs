module.exports = {
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    entry: {
      app: './src/main.ts'
    },
    resolve: { extensions: [".ts", ".tsx", ".js", ".json",".vue"] },
    module: {
      rules: [
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
      ]
    }
  }
}
