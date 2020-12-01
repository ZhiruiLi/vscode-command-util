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

function makeText(tmplString: string): string {
	handlebars.registerHelper("path_basename", (s: string) => path.basename(s));
	handlebars.registerHelper("path_dirname", path.dirname);
	handlebars.registerHelper("path_extname", path.extname);
	const tmpl = handlebars.compile(tmplString);
	const data = {
		"activeEditor": {
			"filePath": vscode.window.activeTextEditor?.document.fileName,
			"position": {
				"line": mayPlus(vscode.window.activeTextEditor?.selection.active.line, 1),
				"column": mayPlus(vscode.window.activeTextEditor?.selection.active.character, 1),
			},
		},
		"window": {
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

function commandExecuteHandler(tmplString: string = "") {
	const txt = makeText(tmplString);
	vscode.env.clipboard.writeText(txt).then(() => {
		log.debug(`CopyText: write to clipboard done, data: '${txt}'`);
	});
};

export function activate(context: vscode.ExtensionContext) {
	const commandCopyText = 'ditto.copyText';
	context.subscriptions.push(vscode.commands.registerCommand(commandCopyText, commandCopyTextHandler));
}

export function deactivate() { }
