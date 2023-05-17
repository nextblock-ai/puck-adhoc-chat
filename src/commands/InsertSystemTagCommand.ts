import * as vscode from "vscode";
import { Command } from "../utils/Command";

// all commands are a subclass of Commandexport default 
export default class InsertSystemTagCommand extends Command {
    systemDelimiter = "👤 ";
    constructor(commandId: string, title: string, context: vscode.ExtensionContext) {
        super(commandId, title, context);
    }
    async execute() {
        // get the active editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        // get the current selection
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        // insert the assistant tag
        editor.edit((editBuilder) => {
            editBuilder.replace(selection, `${this.systemDelimiter}${text}`);
        });
    }
}