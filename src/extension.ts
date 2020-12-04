import * as vscode from 'vscode';
import * as handlebars from 'handlebars';
import * as moment from 'moment';
import * as path from 'path';

namespace log {
	let logChan = vscode.window.createOutputChannel("Ditto");

	function now(): string {
		return moment().format('YYYY-MM-DDThh:mm:ss');
	}

	export function debug(text: string) {
		logChan.appendLine(`[DEBUG ${now()}] ${text}`);
	}

	export function error(text: string) {
		logChan.appendLine(`[ERROR ${now()}] ${text}`);
	}
}

function mayPlus(value: number | undefined, p: number): number {
	if (value === undefined) {
		value = 0;
	}
	return value + p;
}

/**
 * Register handlebars helper functions.
 */
function registerHelpers() {
	handlebars.registerHelper("path_basename", (s: string) => path.basename(s));
	handlebars.registerHelper("path_dirname", path.dirname);
	handlebars.registerHelper("path_extname", path.extname);
	handlebars.registerHelper("path_isAbsolute", path.isAbsolute);
	handlebars.registerHelper("path_normalize", path.normalize);
}

function makeText(tmplString: string): string {
	const tmpl = handlebars.compile(tmplString);
	const data = {
		"activeEditor": {
			"filePath": vscode.window.activeTextEditor?.document.fileName,
			"position": {
				"line": mayPlus(vscode.window.activeTextEditor?.selection.active.line, 1),
				"column": mayPlus(vscode.window.activeTextEditor?.selection.active.character, 1),
			},
			"languageId": vscode.window.activeTextEditor?.document.languageId,
		},
	};
	try {
		return tmpl(data);
	} catch (e) {
		log.error(`MakeText: Fail to run template '${tmplString}': ${e}`);
	}
	return "";
}

function commandCopyTextHandler(tmplString: string = "") {
	const txt = makeText(tmplString);
	vscode.env.clipboard.writeText(txt).then(() => {
		log.debug(`CopyText: write to clipboard done, data: '${txt}'`);
	});
};

function commandExecuteHandler(cmdTmplString: string = "", ...argsTmplStrings: string[]) {
	const cmdTxt = makeText(cmdTmplString);
	const args = argsTmplStrings.map(v => JSON.parse(makeText(v)));
	vscode.commands.executeCommand(cmdTxt, ...args).then(() => {
		log.debug(`Execute: execute command done, command: '${cmdTxt}', arguments: ${args}`);
	});
};

export function activate(context: vscode.ExtensionContext) {
	const commandCopyText = 'ditto.copyText';
	const commandExecute = 'ditto.execute';
	registerHelpers();
	context.subscriptions.push(vscode.commands.registerCommand(commandCopyText, commandCopyTextHandler));
	context.subscriptions.push(vscode.commands.registerCommand(commandExecute, commandExecuteHandler));
}

export function deactivate() { }
