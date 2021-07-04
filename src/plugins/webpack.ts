import address from 'address';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import portfinder from 'portfinder';
import getConfig from './webpack/webpackConfig';
import syscof from '../config/config';
import webpackConfig from '../config/webpack.config';
import { readFile } from '../utils/file'
import cacheFile from './detection/cacheFile'
import _ from 'lodash';


interface WebpackServiceType {
  config?: webpack.Configuration[];// webpack配置文件
  userConfig?: any;                // 用户配置文件
}

// webpack 服务
class WebpackService {
  compiler!: webpack.Compiler;           // 保存webpack对象
  config: webpack.Configuration;         // 配置合集
  api: any;                              // 服务的api
  cwd: string;                           // 用户运行程序路径
  isDev: boolean;                        // 是否开发环境
  cache: cacheFile;                      // 缓存类
  // opts: WebpackServiceType;           // 用户参数

  constructor(api:any){
    this.api = api;
    this.isDev =  api.env === "development";
    this.cwd = api.cwd;
    this.config = {};

    this.cache = new cacheFile(api);
  }

  /**
   * 初始化webpack
   */
  async initWebpack(options) {
    /**
    * 合并对象
    * 因为配置对象可能被多次调用那么回调回来的就是多个所以需要循环
    */
    const userConfig = {
      entry: this.api.cof.userEntryFile,
      output: {
        path: this.api.cof.output
      }
    }

    const param = {
      systemWebpackConfig: webpackConfig,
      userWeboPackConfig: userConfig,
      config: {
        root: this.api.root,
        isDev: options.isDev,
        cwd: this.cwd,
        ...this.api.cof
      }
    }
    
    // 获取配置合集
    this.config = getConfig(param);
    // 创建 compiler
    this.compiler = webpack(this.config);
  }

  // 运行服务
  async run(){
    // 执行缓存类
    this.cache.watch();
    // 初始化webpakc
    this.initWebpack({ isDev: this.isDev });
    // 获取参数
    const devServerOptions = this.config.devServer;
    // 获取地址
    const host = devServerOptions?.host || syscof.host
    // 获取端口
    const port = await portfinder.getPortPromise({ port: devServerOptions?.port || syscof.port });

    // 创建服务
    const server:any = new WebpackDevServer(this.compiler, devServerOptions);
    // 启动服务
    server.listeningApp.listen(port, host, () => {
      server.createSocketServer();
      if (typeof server.options.onListening === 'function') {
        server.options.onListening(server);
      }
    });
    
    // server.app.all("/add", (req:any, res:any, next:any) => {
    //   res.send("xxx")
    // })


    // 启动web服务
    server.app.all("*",(req:any, res:any, next:any) => {
        // 配置404页面
        if(syscof.view404){
          res.send(readFile(syscof.view404));
        }
        next()
    });



    // 获取运行服务的基础信息
    const ip = address.ip();
    
    // 这边到时候添加判断
    const protocol = server.https ? 'https' : 'http';
    const local = `${protocol}://${host}:${port}`;
    const localIp = `${protocol}://${ip}:${port}`;

    const args = { https: protocol, local, localIp, port, ip, host }
    
    // webpack 编译完成执行
    this.compiler.hooks.done.tap('complete', (stats: webpack.Stats) => {
      this.api.applyEvent({ key: "afterComplete", args });
    });
  }
  // 运行webpack 并且返回 compiler 对象
  build(){
    // 执行缓存类
    this.cache.upCache();
    // 初始化webpakc
    this.initWebpack({ isDev: false });
    const compiler = this.compiler;
    compiler.run((err, stats) => {
      // 打包完成以后执行
      this.api.applyEvent({ key: "buildComplete", args: { err, stats } });
    })
  }
}

export default WebpackService

