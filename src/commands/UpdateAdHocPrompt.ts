import * as vscode from "vscode";
import { Command } from "./Command";
import { sendQuery } from "../utils/core";

// this command is used to update the ad-hoc prompt used in the adhoc chat terminal

export default class UpdateAdhocPrompt extends Command {
    constructor(commandId: string, title: string, context: vscode.ExtensionContext) {
        super(commandId, title, context);
    }
    // We use a vs-code input box to get the prompt from the user, and then save the prompt in the extension's
    // global state. The prompt is used in the adhoc chat terminal.
    async execute() {
        const prompt = await vscode.window.showInputBox({ prompt: "Enter a prompt for the query" });
        if (prompt) {
            const config = vscode.workspace.getConfiguration('puck-adhoc-chat');
            config.update('adhocPrompt', prompt, vscode.ConfigurationTarget.Global);
        }
    }
}
