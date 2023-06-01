/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import { ConversationsManager } from "../managers/ConversationsManager";
import { PromptsManager } from "../managers/PromptsManager";
import { SimpleTextEditorTerminal } from "../terminals/SimpleTextEditorTerminal";
import { DocumentManager } from "../managers/DocumentManager";
import { Command } from "./Command";

// all commands are a subclass of Command
export default class AdHocChatCommand extends Command {
    activeTerminal: any;
    // the constructor takes the command name and title, and the extension context
    constructor(commandId: string, title: string, context: vscode.ExtensionContext) {
        super(commandId, title, context);
    }

    // the function that is called when the command is run
    async execute() {

        // these classes manage conversations and prompts
        const conversationsManager = new ConversationsManager(this.context);
        const documentManager = new DocumentManager(this.context);

        // Create a new SimpleTextEditorTerminal and a vscode terminal with the pseudoterminal
        const terminal = new SimpleTextEditorTerminal(conversationsManager, documentManager);
        const vscodeTerminal = vscode.window.createTerminal({
            name: this.title,
            pty: terminal,
        });

        // Show the terminalp
        vscodeTerminal.show();

        vscode.window.onDidChangeActiveTerminal(async (terminal) => {
            if (terminal && terminal.name === this.title) {
                this.activeTerminal = (terminal.creationOptions as vscode.ExtensionTerminalOptions).pty as SimpleTextEditorTerminal;
                terminal.show();
            } 
        });

    }

    // this function is called when the command is registered
    protected onDidRegister(): void {
        // create a status bar item that says "Adhoc Chat"
        const statusBar = vscode.window.createStatusBarItem( vscode.StatusBarAlignment.Right, 100);
        statusBar.text = "Open Adhoc Chat";
        statusBar.command = this.commandId;
        statusBar.show();
        this.context.subscriptions.push(statusBar);
    }
}
