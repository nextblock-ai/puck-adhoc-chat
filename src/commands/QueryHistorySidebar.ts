import * as vscode from "vscode";
import { Command } from "../utils/Command";
import { loadMessages } from "../utils/gpt";

// This command implememnts a sidebar that shows the query history. we implement the view as a webviewview, 
// which is a webview that is embedded in the sidebar. The webview is implemented below.

export default class QueryHistorySidebar extends Command {
    constructor(commandId: string, title: string, context: vscode.ExtensionContext) {
        super(commandId, title, context);

        const messages = loadMessages();

        // register the webviewview provider
        context.subscriptions.push(vscode.window.registerWebviewViewProvider("puck.adhocChat.query-history-sidebar-view", new QueryHistorySidebarProvider(context.extensionUri, messages)));

        // register the command to open the sidebar
        context.subscriptions.push(vscode.commands.registerCommand("puck.adhocChat.query-history-sidebar-view.open", () => {
            vscode.commands.executeCommand("workbench.view.extension.query-history-sidebar-view");
        }));

        // register the command to clear the query history
        context.subscriptions.push(vscode.commands.registerCommand("puck.adhocChat.query-history-sidebar-view.clear", () => {
            vscode.commands.executeCommand("query-history.clear");
        }));
    }

    async execute() {
        // open the sidebar
        vscode.commands.executeCommand("workbench.view.extension.query-history-sidebar-view");
    }
}

// webviewview is a webview that is embedded in the sidebar. The webview is implemented below.

function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    } return text;
}

export class QueryHistorySidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;
    _disposables: vscode.Disposable[] = [];
    constructor(private readonly _extensionUri: vscode.Uri, public messages: any[]) {}
    public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken) {
        this._view = webviewView;
        this._doc = (context as any)?.backupResource;
        this._view.webview.options = {
            enableScripts: true,
        };
        this._view.webview.html = this._getHtmlForWebview(this._view.webview);
        this._view.webview.onDidReceiveMessage((data) => {
            switch (data.type) {
                case "alert":
                    vscode.window.showErrorMessage(data.value);
                    return;
            }
        }, undefined, this._disposables);
    }
    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }
    public dispose() {

    }

    // this show a card view of the query history, each card is a query and response pair.
    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "main.js"));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "main.css"));
        const nonce = getNonce();
        const messages = this.messages;
        return `<html lang="en" data-vsc-extension-kind="webview">
        <head>
            <meta charset="UTF-8">
            <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
            -->
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: vscode-resource:; script-src 'nonce-${nonce}';">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${styleUri}" rel="stylesheet">
            <title>Query History</title>
        </head>
        <body>
            <h1>Query History</h1>
            <div class="container">
                ${messages.map((message) => {
                    return `<div class="card">
                        <div class="card-header">
                            <div class="card-header-title">${message.query}</div>
                        </div>
                        <div class="card-content">
                            <div class="content">
                                ${message.response}
                            </div>
                        </div>
                    </div>`;
                }).join("")}
            </div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
    }
}
