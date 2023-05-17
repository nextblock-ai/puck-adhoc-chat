import * as vscode from "vscode";

import SetOpenAIKeyCommand from "./SetOpenAIKeyCommand";
import AdHocChatCommand from "./AdHocChatCommand";
import InsertAssistantTagCommand from "./InsertAssistantTagCommand";
import InsertUserTagCommand from "./InsertUserTagCommand";
import InsertSystemTagCommand from "./InsertSystemTagCommand";
import SubmitChatCommand from "./SubmitChatCommand";

export function activate(context: vscode.ExtensionContext) {

    new SetOpenAIKeyCommand("setOpenAIKey", "Set OpenAI Key", context);
    new AdHocChatCommand("adhocChat", "Adhoc Chat", context);
    new InsertAssistantTagCommand("insertAssistantTag", "Insert 🤖", context);
    new InsertUserTagCommand("insertUserTag", "Insert 👤", context);
    new InsertSystemTagCommand("insertSystemTag", "Insert 🌐", context);
    new SubmitChatCommand("submitChat", "Submit Chat", context);

}


export function deactivate() { }