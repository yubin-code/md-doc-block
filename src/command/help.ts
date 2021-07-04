import fs from 'fs';
import message from '../utils/message';
import Markdown from '../plugins/markdown';
// 注册插件
export default (api: any) => {
  // const m = new Markdown({ cwd: api.cwd, userCodePath: "code" });
  // const md = fs.readFileSync('/Users/admin/app/doc/index.md', 'utf-8');
  // const html = m.content(md);

  message.help();
  process.exit(1);
  // console.log(html)
}
