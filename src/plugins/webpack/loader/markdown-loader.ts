import MarkdownPlug from '../plug/webpackMarkdown';
import { editSuffix, getHash } from '../../../utils/index';
module.exports = async function (
  this: any,
  source:string|Buffer
){
	const callback = this.async();
  const options = this.getOptions();
  
  const resourcePath = this.resourcePath;
  // 用户配置文件属性
  let name = editSuffix(options.docsPath, resourcePath, "md", "html");
  MarkdownPlug.setData({
    context: source,
    hash: getHash(10),
    name,
  });

  const resultSource = `// extracted by ${MarkdownPlug.pluginName} \n
  export {};`;
  // 添加一个文件作为加载器结果的依赖项
  this.addDependency(this.resourcePath);
  
  callback(null, resultSource);
}
