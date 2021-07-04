import path from 'path';
import Spinnies from 'spinnies';
import { prompt } from 'inquirer';
import { mkDir, writeFile, readFile } from '../utils/file';
import { isAllowInit } from '../utils/build';
import message from '../utils/message';
import syscof from '../config/config';
import _ from 'lodash';
// 初始化
export default (api: any) => {
  const userCwd = api.cwd;
  
  // 判断是否允许初始化
  if(!isAllowInit(userCwd)){
    return;
  }

  const parameter = [
    { type : 'input', name : 'title', default: '文档系统 {name}', message : '请输入文档系统title：' },
    { type : 'input', name : 'docsPath', default: 'docs', message : '请输入文档目录：' },
    { type : 'input', name : 'codePath', default: 'code', message : '请输入代码目录：' },
    { type : 'input', name : 'assets', default: 'assets', message : '请输入资源文件目录：' },
    { type: 'confirm', name: 'multiple', message: '是否为多文档模式？', default: false, },
  ];
  // const pkg = require(join(api.root, 'package.json'));
  prompt(parameter).then(opt => {
    const spinnies = new Spinnies();
    spinnies.add('init', { text: "init project" });
    
    // 模板文件
    let template = readFile(path.resolve(api.root, "userTemplate/index.md" ));
    template = template.replace("{title}", opt.title);

    // 创建文件
    if(!_.isEmpty(opt.docsPath)) {
      mkDir(path.resolve(api.cwd, opt.docsPath));
      writeFile(path.resolve(api.cwd, opt.docsPath, "index.md"), template);
    };
    
    if(!_.isEmpty(opt.codePath)) mkDir(path.resolve(api.cwd, opt.codePath));
    if(!_.isEmpty(opt.assets)) mkDir(path.resolve(api.cwd, opt.assets));
    writeFile(path.resolve(api.cwd, syscof.userConfigName), JSON.stringify(opt, null, 2));

    // 成功提示与退出
    spinnies.succeed('init', { text: "init success" });
    message.initSucceed();
    process.exit(1);
  });
}

