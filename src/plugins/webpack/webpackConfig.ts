import webpack from 'webpack';
import Config from 'webpack-chain';
import merge from 'webpack-merge';
import _ from 'lodash';

/**
 * 导出webpack的配置
 * userConfig 用户配置文件
 * systemConfig 系统配置文件
 * isDev 是否为开发环境
 * cwd 程序执行目录
 */
export default (param:any):webpack.Configuration => {
  const config = new Config();
  // userConfig: webpack.Configuration={}, systemConfig:any

  // 设定条件设置值
  // 设置map不然浏览器终端有警告提示
  config.when(param.config.isDev,
    config => config.devtool('inline-source-map')
  )
  
  // friendly-errors-webpack-plugin 插件可以让webpack 不显示那么多没有用多信息
  config.plugin('friendly-error')
    .use(require.resolve('friendly-errors-webpack-plugin'), [ { clearConsole: false } ]);
  // 设置代码版权说明
  config.plugin('banner-plugin').use(webpack.BannerPlugin, ["版权说明"]);
  // webpackbar 插件可以显示webpack 编译的时候的进度条
  config.plugin('progress').use(require.resolve('webpackbar'));

  // md 转 Html
  config.plugin('webpack-markdown')
    .use(require.resolve('./plug/webpackMarkdown'), [ param.config ]);
    
  config.stats("errors-only");
  // 提供 mode 配置选项，告知 webpack 使用相应模式的内置优化。
  config.mode(param.config.isDev? "development" : "production");
  
  // 设置md的loader
  config.module.rule('md')
    .test(/\.md$/).use('md-loader')
    .loader(require.resolve('./loader/markdown-loader'))
    .options(param.config);

  
  // 服务器设置
  config.devServer
    .host(process.env.HOST || '0.0.0.0')  // 设置地址api 0.0.0.0 主要是让他能在局域网内被访问到
    .quiet(true)                // 不再终端显示多余的编译信息
    .clientLogLevel("none")     // 禁止浏览器控制台socket的log输出
    .stats(false)               // 不显示统计信息
    .writeToDisk(false)         // 不写入硬盘直接写入内存
  
  // 设置资源入口
  config.devServer.contentBase(param.config.contentBase);
  return merge(config.toConfig(), param?.userWeboPackConfig, param?.systemWebpackConfig)
}