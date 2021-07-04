import assert from 'assert';
import { EventEmitter } from 'events';
import { AsyncSeriesWaterfallHook } from 'tapable';
import { ServiceOpts, EventType } from "./types";
import { resolvePath } from './pluginLoader'

export default class Service extends EventEmitter {
  // 用户目录
  cwd: string;
  env: string | undefined;

  // 附加数据提供子类使用
  additive:{
    [key: string]: any
  };
  // 保存指令
  commands: {
    [name: string]: { fn: Function, cwd: string };
  } = {};

  // 保存插件与事件
  plugins: {
    [name: string]: Function;
  } = {};


  // 事件钩子
  hook: {
    [name: string]: { key: string, fn: Function }[];
  } = {}

  // 事件
  events: {
    [key: string]: EventType;
  } = {};
  
  // 构造方法
  constructor(){
    super();
    this.cwd = '';
    // 附加数据提供子类使用
    this.additive = {};
    // 如果没有设置环境变量一律按开发环境算
    this.env = process.env.NODE_ENV || 'development';
  }
  
  init(opts:ServiceOpts){
    // 获取命令执行路径
    this.cwd = opts.cwd;
    this.registerCommand(opts); // 注册指令
    this.registerEvent(opts);   // 注册事件
    this.registerPlugin(opts);  // 注册插件
  }

  /**
   * 获取插件的api
   * @param opts 获取api
   */
    getPluginAPI(){
    /**
     * proxy 的方式动态获取最新，以实现边注册边使用的效果
     */
    return new Proxy({}, {
      get: (target, prop: string) => {
        // 允许读取插件
        if (this.plugins[prop]){
          return this.plugins[prop];
        }
        
        // 提供子类保存数据通讯
        if(this.additive[prop]){
          return this.additive[prop]
        }
        
        // 允许用户读取service上指定的方法
        if(
          [
            'cwd',
            'env',
            'applyEvent',
          ]
          .includes(prop)
        ){
          return typeof this[prop] === 'function'
            ? this[prop].bind(this)
            : this[prop];
        }
        return target[prop];
      },
    })
  }

  // 注册插件
  registerPlugin(opts:ServiceOpts){
    const api = this.getPluginAPI();
    // 注册指令
    const plugin = resolvePath('plugins', {
      cwd: this.cwd,
      // 系统插件
      plugins: opts.plugins,
      // 用户插件
      userPlugins: [],
    });
    
    // 注册插件
    plugin.map(item => {
      assert(!this.plugins[item.key], `api.registerPlugin() 注册失败, plugins 的 ${item.key} 已经存在.`);
      const cla = item.apply();
      this.plugins[item.key] = new cla(api);
    })
  }

  // 注册事件
  registerEvent(opts:ServiceOpts){
    if(opts.event && opts.event.length > 0){
      opts.event.forEach(item => {
        this.events[item] = { key: item }
        this.plugins[item] = (fn:Function) => {
          this.hook[item] = ( this.hook[item]|| [] ).concat({
            key: item,
            fn,
          });
        }
      })
    }
  }

  // 应用事件
  async applyEvent(opts: { key: string, args?: any }){
    const Event = this.events[opts.key];
    const IHook = new AsyncSeriesWaterfallHook(['_']);
    const data = this.hook[opts.key]
    if(!data) return;
    for (const hook of data) {
      IHook.tapPromise(
        {
          name: opts.key,
          stage: Event.stage || 0,
          // @ts-ignore
          before: Event.before,
        },
        async (memo: any) => {
          return await hook.fn(memo, opts.args);
        },
      );
    }
    return await IHook.promise(opts.args);
  }
  // 注册指令
  registerCommand(opts: ServiceOpts){
    // 注册指令
    const command = resolvePath('commands',{
      cwd: this.cwd,
      // 系统指令
      commands: opts.commands,
      // 用户指令
      userCommands: [],
    });
    
    command.map(item => {
      assert(!this.commands[item.key], `api.registerCommand() 注册失败, commands 的 ${item.key} 已经存在.`);
      this.commands[item.key] = {
        cwd: item.cwd,
        fn: item.apply()
      }
    })
  }

  // 运行指令
  runCommand({ name, args = {} }: { name: string; args?: any }){
    const api = this.getPluginAPI();
    args._ = args._ || [];
    const command = this.commands[name];
    assert(command, `运行命令失败 ${name} 命令不存在`);
    const { fn } = command as any;
    return fn(api, args);
  }
}
