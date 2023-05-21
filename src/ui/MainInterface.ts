import * as vscode from 'vscode';
import { Toolbar } from '../composer/Toolbar';
import { Canvas, CanvasClickEvent } from '../composer/Canvas';

export class MainInterface {
    private readonly context: vscode.ExtensionContext;
    private readonly webviewPanel: vscode.WebviewPanel;
    private readonly toolbar: Toolbar;
    private readonly canvas: Canvas;

    constructor(context: vscode.ExtensionContext, panel: vscode.WebviewPanel) {
        this.context = context;
        this.webviewPanel = panel;
        this.toolbar = new Toolbar();
        this.canvas = this.createCanvas();
        this.initCommands();
    }

    private createCanvas(): Canvas {
        // Container and canvas element ids should match the ones defined in the webview HTML.
        const containerId = 'canvas-container';
        const canvasId = 'canvas';
        return new Canvas(containerId, canvasId);
    }

    private initCommands(): void {
        this.initAddNodeCommand();
        this.initZoomInCommand();
        this.initZoomOutCommand();
        this.initDebugCommand();
        this.canvas.onClick(this.handleCanvasClick.bind(this));
    }

    private initAddNodeCommand(): void {
        const addNodeDisposable = vscode.commands.registerCommand('composer.addNode', () => {
            this.addNewNode();
        });
        this.context.subscriptions.push(addNodeDisposable);
    }

    private initZoomInCommand(): void {
        const zoomInDisposable = vscode.commands.registerCommand('composer.zoomIn', () => {
            this.canvas.zoomIn();
        });
        this.context.subscriptions.push(zoomInDisposable);
    }

    private initZoomOutCommand(): void {
        const zoomOutDisposable = vscode.commands.registerCommand('composer.zoomOut', () => {
            this.canvas.zoomOut();
        });
        this.context.subscriptions.push(zoomOutDisposable);
    }

    private initDebugCommand(): void {
        const debugCommandDisposable = vscode.commands.registerCommand('composer.startDebug', () => {
            // Implement the start debugging functionality.
            console.log('Debugging started');
        });
        this.context.subscriptions.push(debugCommandDisposable);
    }

    private addNewNode(): void {
        // Create a new node HTMLElement and add it to the canvas.
        const newNode = document.createElement('div');
        newNode.className = 'composer-node';
        newNode.innerHTML = '<span>New Node</span>';
        this.canvas.addNode(newNode);
    }

    private handleCanvasClick(event: CanvasClickEvent): void {
        console.log(`Canvas clicked at (${event.x}, ${event.y})`);
        // Implement additional click handling logic if needed.
    }

    show(): void {
        this.toolbar.show();
        this.webviewPanel.reveal();
    }

    dispose(): void {
        this.toolbar.dispose();
        this.webviewPanel.dispose();
    }
}