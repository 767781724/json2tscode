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
  try {
    return Promise.resolve(camelizeKeys(JSON.parse(json)));
  } catch (ignored) {}

  try {
    return Promise.resolve(tryEval(json));
  } catch (error) {
    return Promise.reject(new Error("JSON 格式 无效"));
  }
}
export function json2tscode(json: Object): string {
  const arr = [];
  for (const key in json) {
    arr.push(
    `{\n\tdataIndex: '${key}',\n\ttitle: intl.get('${key}')\n}`);
  }
  return arr.reduce((a, b) => `${a},\n${b}`);
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
