import yParser from 'yargs-parser'
import chalk from 'chalk'
import Service from './service/index'
import fork from './service/fork'
import { getUserCwd } from './utils/index';

const args = yParser(process.argv.slice(2), {
  alias: { 
    version: ['v'],
    help: ['h'],
  },
  boolean: ['version'],
});

if (args.version && !args._[0]) {
  args._[0] = 'version';
  console.log(`v${require('../package.json').version}`);
  process.exit(1);
} else if (!args._[0]) {
  args._[0] = 'help';
}

(async () => {
  try {
    switch (args._[0]) {
      // 运行dev
      case 'dev':
        const child = fork({ scriptPath: require.resolve('./index') })
        
        process.on('SIGINT', () => {
          child.kill('SIGINT');
        });
        process.on('SIGTERM', () => {
          child.kill('SIGTERM');
        });
        break;
      // 其他指令
      default:
        const name = args._[0];
        const service = await new Service({
          cwd: getUserCwd(),
        });
        // 执行指令
        service.runCommand({ name, args, });
        // 执行启动事件
        service.applyEvent({ key: "onStart" });
        break; 
    }
  }  catch (e) {
    console.error(chalk.red(e.message));
    process.exit(1);
  }
})()