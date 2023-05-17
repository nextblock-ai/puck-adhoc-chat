import * as vscode from 'vscode';
import * as commands from './commands';
import * as outputlog from './utils/outputLog';

export function activate(context: vscode.ExtensionContext) {

	outputlog.activate(context);
	commands.activate(context);

}

export function deactivate() {}