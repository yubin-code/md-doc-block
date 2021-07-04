import fs from 'fs-extra';
import message from '../utils/message';
// 注册插件
export default (api: any, args: any) => {
  const webpack = api.webpack;
  // 项目启动执行
  api.onStart(() => {
    // 打包之前先删除之前的文件夹
    fs.removeSync(api.cof.output)
    // 执行webpack
    webpack.build();
  });
  
  // 打包完成执行
  api.buildComplete((res) => {
    fs.copySync(api.cof._assets, api.cof.output);
    fs.copySync(api.cof.assets, api.cof.output);
    fs.copySync(api.cof.codePath, api.cof.output);
    message.buildSucceed();
    process.exit(1);
  })
}