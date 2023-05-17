/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import { Command } from "../utils/Command";
import { sendChatQuery, sendQuery } from "../utils/gpt";
import { DocumentManager } from "../managers/DocumentManager";
import { ConversationsManager } from "../managers/ConversationsManager";
import { PromptsManager } from "../managers/PromptsManager";

const personDelimiter = "👤";
const assistantDelimiter = "🤖";
const systemDelimiter = "🌐";

function getRoleEmoji(role: string) {
    switch (role) {
        case "user":
            return personDelimiter;
        case "assistant":
            return assistantDelimiter;
        case "system":
            return systemDelimiter;
        default:
            return personDelimiter;
    }
}

const org = "puck.adhocChat";

// all commands are a subclass of Command
export default class SubmitChatCommand extends Command {

    documentManager: DocumentManager;
    conversationManager: ConversationsManager;
    promptManager: PromptsManager;

    constructor(commandId: string, title: string, context: vscode.ExtensionContext) {

        // call the parent constructor
        super(`${org}.${commandId}`, title, context);

        // we need prompts, conversations and documents
        this.documentManager = new DocumentManager(context);
        this.conversationManager = new ConversationsManager(context);
        this.promptManager = new PromptsManager(context);

    }
    
    // if the open document contains any delimiter, then it is a chat
    async execute() {
        // get the active editor
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
        return;
        }
        // get the document contents
        const text = editor.document.getText();
        const prompt = await this.promptManager.getDefaultPrompt();
        if(text.includes(personDelimiter) || text.includes(assistantDelimiter) || text.includes(systemDelimiter)) {
            
            // if the selection contains any of the delimiters, then it is a chat
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
            return;
            }
            // get the document contents
            let currentActiveFileMessages: any = editor.document.getText();
            
            // parse the messages from the active file
            currentActiveFileMessages = await this.conversationManager.getMessagesFromString(currentActiveFileMessages || '');
            const preCallCount = currentActiveFileMessages.length;
            let newline = '';
        
            // if the last message doesn't end with a newline, add one
            let messagesString = '';
            if(preCallCount > 0) {
                newline = '\n';
                messagesString = currentActiveFileMessages.map(
                    (msg:any) => `${msg.role} ${msg.content}`
                ).join('');
    
            } else if(preCallCount === 0 && prompt && prompt.length > 0) { 
                // else there are no messages
                messagesString = `${newline}${systemDelimiter} ${prompt}\n`;
            }
    
            // get the response from the api
            const outputMessages = await sendChatQuery(currentActiveFileMessages as any, prompt, undefined);
            // add the response to the editor
            const msg =  outputMessages[outputMessages.length -1 ];
    
            const outputMessagesString = `${getRoleEmoji(msg.role)} ${msg.content}`;
    
            await this.documentManager.insertIntoDocument(
                `${outputMessagesString}\n`
            );
        }
    }
}

export async function handleChatMessage(
    documentManager: DocumentManager, 
    conversationManager: ConversationsManager, 
    prompt: string, message: string): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
        return;
        }
        // get the document contents
        let currentActiveFileMessages: any = editor.document.getText();
        
        // parse the messages from the active file
        const msgsStr =  await conversationManager.getMessagesFromString(currentActiveFileMessages || '');
        currentActiveFileMessages = msgsStr;
        const preCallCount = currentActiveFileMessages.length;

        // if the last message doesn't end with a newline, add one
        if(preCallCount > 0) {
            // insert the user's message into the editor
            await documentManager.insertIntoDocument(
                `${personDelimiter} ${message}\n`
            );  

        } else if(preCallCount === 0 && prompt && prompt.length > 0) { 
            // insert the user's message into the editor
            await documentManager.insertIntoDocument(
                `${systemDelimiter} ${prompt}\n${personDelimiter} ${message}\n`
            );  
        }

        // get the response from the api
        const outputMessages = await sendChatQuery(currentActiveFileMessages as any, prompt, message);
        // add the response to the editor
        const msg =  outputMessages[outputMessages.length -1 ];

        const outputMessagesString = `${getRoleEmoji(msg.role)} ${msg.content}`;

        await documentManager.insertIntoDocument(
            `${outputMessagesString}\n`
        );
}
