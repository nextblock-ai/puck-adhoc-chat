import * as vscode from "vscode";

import SetOpenAIKeyCommand from "./SetOpenAIKeyCommand";
import AdHocChatCommand from "./AdHocChatCommand";
import InsertAssistantTagCommand from "./InsertAssistantTagCommand";
import InsertUserTagCommand from "./InsertUserTagCommand";
import InsertSystemTagCommand from "./InsertSystemTagCommand";
import SubmitChatCommand from "./SubmitChatCommand";
import QueryHistorySidebar from "./QueryHistorySidebar";
import ReplaceWithCompletion from "./ReplaceWithCompletion";

export function activate(context: vscode.ExtensionContext) {

    new AdHocChatCommand("adhocChat", "Adhoc Chat", context);
    new SetOpenAIKeyCommand("setOpenAIKey", "Set OpenAI Key", context);
    
    new InsertAssistantTagCommand("puck.adhocChat.insertAssistantTag", "Insert 🤖", context);
    new InsertUserTagCommand("puck.adhocChat.insertUserTag", "Insert 👤", context);
    new InsertSystemTagCommand("puck.adhocChat.insertSystemTag", "Insert 🌐", context);
    new QueryHistorySidebar("puck.adhocChat.queryHistorySidebar", "View Query History", context);
    new ReplaceWithCompletion("puck.adhocChat.replaceWithCompletion", "Replace with Completion", context);

    new SubmitChatCommand("puck.adhocChat.submitChat", "Submit Chat", context);

}


export function deactivate() { }