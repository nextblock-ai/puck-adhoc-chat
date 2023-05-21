import * as vscode from "vscode";
import { Command } from "../utils/Command";
import { sendQuery } from "../utils/gpt";

// This command implememnts a sidebar that shows the query history. we implement the view as a webviewview, 
// which is a webview that is embedded in the sidebar. The webview is implemented below.

export default class ReplaceWithCompletionView extends Command {
    constructor(commandId: string, title: string, context: vscode.ExtensionContext) {
        super(commandId, title, context);
    }
    // we get the currently-selected text in the editor, gather an optional prompt from the user, and then
    // send the query to the server. The server returns a result, which we use to replace the selected text
    async execute() {
        // open the sidebar
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const selection = editor.selection;
        const messages = [];
        let text = editor.document.getText(selection);
        const prompt = await vscode.window.showInputBox({ prompt: "Enter a prompt for the query" });
        if (prompt) {
            messages.push({
                role: 'system',
                content: prompt
            });
        }
        messages.push({
            role: 'user',
            content: text
        });
        const results = await sendQuery({
            model: 'gpt-4',
            temperature: 1,
            top_p: 1,
            max_tokens: 2048,
            messages
        } as any);
        if (!results) { return; }
        await editor.edit((editBuilder) => {
            editBuilder.replace(selection, results);
        });
    }
}
