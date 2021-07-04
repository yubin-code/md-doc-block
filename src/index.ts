import yParser from 'yargs-parser'
import Service from './service/index'
import { getUserCwd } from './utils/index';
(async () => {
  const service = new Service({
    cwd: getUserCwd()
  })
  
  const args = yParser(process.argv.slice(2), {});
  service.runCommand({ name: "dev", args })

  // 执行启动事件
  service.applyEvent({ key: "onStart" });
  // 管理退出进程
  let closed = false;
  function onSignal(signal: string) {
    if (closed) return; 
    closed = true;
    // 退出时触发插件中的onExit事件
    service.applyEvent({ key: "onExit" });
    process.exit(0);
  }
  
  // kill(2) Ctrl-C
  process.once('SIGINT', () => onSignal('SIGINT'));
  // kill(3) Ctrl-\
  process.once('SIGQUIT', () => onSignal('SIGQUIT'));
  // kill(15) default
  process.once('SIGTERM', () => onSignal('SIGTERM'));

})()