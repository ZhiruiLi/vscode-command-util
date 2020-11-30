import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.debug('Extension "command-util" is now active!');
	let disposable = vscode.commands.registerCommand('command-util.copyText', () => {
		vscode.window.showInformationMessage('Hello World from command-util!');
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }
