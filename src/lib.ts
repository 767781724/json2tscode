import * as vscode from 'vscode';
import { readSync } from 'clipboardy';
import { camelizeKeys } from 'humps';

export function getClipboardText() {
  try {
    return Promise.resolve(readSync());
  } catch (error) {
    return Promise.reject(error);
  }
}
// 验证长度
export const validateLength = (text: any) => {
  if (text.length === 0) {
    return Promise.reject(new Error("Nothing selected"));
  } else {
    return Promise.resolve(text);
  }
};
export function parseJson(json: string): Promise<object> {  
  const tryEval = (str: any) => eval(`const a = ${str}; a`);
  // 下划线转驼峰
  // try {
  //   return Promise.resolve(camelizeKeys(JSON.parse(json)));
  // } catch (ignored) {}

  try {
    return Promise.resolve(tryEval(json));
  } catch (error) {
    return Promise.reject(new Error("JSON 格式 无效"));
  }
}

export function json2Columns(json: Object): string {
  const filter = [];
  const columns = [];
  for (const key in json) {
    const keyStr = key.split('_');
    if (keyStr[0] === "f"){
      filter.push(
        `{\n\tid: '${keyStr[keyStr.length-1]}',\n\tlabel: intl.get('${key}'),\n\t_node: <Input />,\n}`
      );
    } else if (keyStr[0] === "c") {
      columns.push(`{\n\tdataIndex: '${keyStr[keyStr.length-1]}',\n\ttitle: intl.get('${key}')\n}`);
    } else if (keyStr[0] === "fc") {
      filter.push(
        `{\n\tid: '${keyStr[keyStr.length-1]}',\n\tlabel: intl.get('${key}'),\n\t_node: <Input />,\n}`
      );
      columns.push(`{\n\tdataIndex: '${keyStr[keyStr.length-1]}',\n\ttitle: intl.get('${key}')\n}`);
    }
  }
  const rstr = `conditions={[\n${filter.reduce((a, b) => `${a},\n${b}`)}\n]}\ncolumns={[\n${columns.reduce((a, b) => `${a},\n${b}`)}\n]}`;
  return rstr;
}
export function pasteToMarker(content: string) {
  const { activeTextEditor } = vscode.window;

  return activeTextEditor?.edit((editBuilder) => {
    editBuilder.replace(activeTextEditor.selection, content);
  });
}
export function handleError(error: Error) {
  vscode.window.showErrorMessage(error.message);
}
export function parseObject (obj: string): Promise<Object> {
  const tryEval = (str: any) => eval(`const a = ${str}; a`);
  try {
    return Promise.resolve(tryEval(`{${obj}}`));
  } catch (error) {
    return Promise.resolve(new Error("Object格式错误"));
  }
}

export function json2intl(json: Object): string {
  const arr = [];
  for (const key in json) {
    arr.push(
      `intl.get('${key}')`
    );
  }
  return arr.reduce((a, b) => `${a},\n${b}`);
}