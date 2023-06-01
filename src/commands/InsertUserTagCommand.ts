import * as vscode from "vscode";
import { Command } from "./Command";

// all commands are a subclass of Commandexport default 
export default class InsertUserTagCommand extends Command {
    userDelimiter = "👤 ";
    constructor(commandId: string, title: string, context: vscode.ExtensionContext) {
        super(commandId, title, context);
    }
    async execute() {
        // get the active editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        // get the current cursor location
        const position = editor.selection.active;
        // insert the assistant delimiter
        await editor.edit((editBuilder) => {
            editBuilder.insert(position, this.userDelimiter);
        });
    }
}