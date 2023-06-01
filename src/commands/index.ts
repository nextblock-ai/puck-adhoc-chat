import * as vscode from "vscode";

import AdHocChatCommand from "./AdHocChatCommand";
import InsertAssistantTagCommand from "./InsertAssistantTagCommand";
import InsertUserTagCommand from "./InsertUserTagCommand";
import InsertSystemTagCommand from "./InsertSystemTagCommand";
import SubmitChatCommand from "./SubmitChatCommand";
import ReplaceWithCompletion from "./ReplaceWithCompletion";
import InsertWithCompletion from "./InsertWithCompletion";

export function activate(context: vscode.ExtensionContext) {

    new AdHocChatCommand("puck.adhocChat.adhocChat", "Adhoc Chat", context);
    new InsertAssistantTagCommand("puck.adhocChat.insertAssistantTag", "Insert 🤖", context);
    new InsertUserTagCommand("puck.adhocChat.insertUserTag", "Insert 👤", context);
    new InsertSystemTagCommand("puck.adhocChat.insertSystemTag", "Insert 🌐", context);
    new SubmitChatCommand("puck.adhocChat.submitChat", "Submit Chat", context);
    new ReplaceWithCompletion("puck.adhocChat.replaceWithCompletion", "Replace with Completion", context);
    new InsertWithCompletion("puck.adhocChat.insertWithCompletion", "Insert with Completion", context);

}


export function deactivate() { }