// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getClipboardText, handleError, json2Columns, json2intl, parseJson, parseObject, pasteToMarker, validateLength } from './lib';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "json2tscode" is now active!');

  context.subscriptions.push(vscode.commands.registerCommand('json2tscode.clipboard2columns', transformClipboard2columns));
  context.subscriptions.push(vscode.commands.registerCommand('json2tscode.clipboard2intl', transformClipboard2intl));
}

function transformClipboard2columns() {
  getClipboardText()
    .then(validateLength)
    .then(parseJson)
    .then(json2Columns)
    .then((interfaces) => {
      pasteToMarker(interfaces);
    })
    .catch(handleError);
}
function transformClipboard2intl() {
  getClipboardText()
    .then(validateLength)
    .then(parseObject)
    .then(json2intl)
    .then((interfaces) => {
      pasteToMarker(interfaces);
    })
    .catch(handleError);
}
// this method is called when your extension is deactivated
export function deactivate() {}
