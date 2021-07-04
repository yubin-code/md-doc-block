import _ from "lodash";
import { isInit } from '../utils/build';
import message from '../utils/message';

// 开发环境
export default (api:any, args: any) => {
  const webpack = api.webpack;
  let isFirst = true;
  // 判断用户是否初始化
  if(!isInit()){
    return
  }

  // 项目启动执行
  api.onStart(() => {
    // 执行webpack
    webpack.run();
  })
  
  // 编译完成
  api.afterComplete((e) => {
    // 如果第一次运行输出地址信息
    if(isFirst){
      isFirst = false;
      message.runSucceed(e.local, e.localIp)
    }
  });
}