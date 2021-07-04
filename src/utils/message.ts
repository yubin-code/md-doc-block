import chalk from 'chalk';

/**
 * 统一化信息提示
 */
export default {
  // 错误信息提示
  error: (err: { message: string, title?: string }) => {
    // 设置配置
    console.log([
      '',
      `${chalk.white.bgRed(" ERROR ")} ${chalk.red(err.title|| '')}`,
      `${err.message}`,
      ''
    ].join('\n'));
  },
  // 不允许初始化的提示
  noInit: () => {
    console.log([
      "",
       ` ${chalk.bgRed(" error ")} ${chalk.red("非空目录无法初始化")}`,
       "",
       ` ${chalk.bgRed(" error ")} 请新建一个新目录后在尝试`,
       "",
     ].join('\n'));
  },
  // 创建项目成功提示
  initSucceed: () => {
    console.log(
      [
        ` ${chalk.white.bgGreen(" 启动项目 ")} doc dev`,
      ]
      .filter(Boolean)
      .join('\n')
    );
  },
  // 运行成功提示
  runSucceed: (local: string, localIp: string) => {
    console.log([
      `  服务运行成功:`,
      `  - 地址:   ${chalk.green(local)}`,
      localIp && `  - 内网地址: ${chalk.green(localIp)}`,
    ]
    .filter(Boolean)
    .join('\n'))
  },
  buildSucceed(){
    console.log([
      "=============",
      ` 🐤打包成功   `,
      "=============",
    ].filter(Boolean)
    .join('\n'));
  },
  help: () => {
    console.log([
      '',
      `Usage: webpc <command>`,
      '',
      'Commands:',
      '',
      `  ${chalk.cyan('init')}     初始化项目`,
      `  ${chalk.cyan('build')}    打包应用程序`,
      `  ${chalk.cyan('dev')}      启动服务器进行开发`,
      `  ${chalk.cyan('-h')}       显示帮助`,
      `  ${chalk.cyan('-v')}       显示版本`,
      "",
      `详细内容 ${chalk.whiteBright('https://github.com/yubin-code')}`,
      ""
   ].join('\n'))
  }
}