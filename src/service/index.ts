import Service from './service';
import { getMethodPath } from './pluginLoader';
import { ServiceOpts } from './types';
import event from './event'
import { getConfig } from '../config/index';
import syscof from '../config/config'
class InitService extends Service{
  constructor(opts: ServiceOpts){
    super();
    
    // 获取根路径
    this.additive['root'] = syscof.root;
    // 保存用户配置文件
    this.additive['cof'] = getConfig(opts);
    // 初始化执行项目
    this.init({
      ...opts,
      // 获取指令
      commands: getMethodPath("command"),
      // 获取插件
      plugins: getMethodPath("plugins"),
      // 获取事件
      event: event,
    });
  }
}

export default InitService