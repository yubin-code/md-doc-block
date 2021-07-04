export type NodeEnv = 'development' | 'production';


export interface CommandType {
  name: string;
  description?: string;
  fn: {
    ({ args }: { args: any }): void;
  };
}

// 通用参数
export interface Dep {
  [name: string]: string;
}


// 指令，插件等等类型
export interface ExtendType {
  id?: string;
  path?: string;
  key: string;
  cwd: string;
  apply: Function;
}

// package.js 文件需要获取的参数
export interface Package {
  name?: string;
  dependencies?: Dep;
  devDependencies?: Dep;
  [key: string]: any;
}

// 核心函数service参数
export interface ServiceOpts {
  cwd: string;              // 运行指令的目录
  pkg?: Package;            // package.json 文件信息
  env?: NodeEnv;            // 环境变量
  configName?: string;      // 配置文件名字
  // 插件
  plugins?: string[];
  // 指令
  commands?: string[];
  // 事件
  event?: string[];
}


// 事件类型
export interface EventType{
  key: string;
  fn?: Function;
  before?: string;
  stage?: number;
}