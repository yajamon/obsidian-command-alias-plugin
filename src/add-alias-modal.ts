import { App, FuzzySuggestModal, Modal } from "obsidian";
import { AppExtension } from "./uncover-obsidian";

interface SuggestElement {
    commandId: string;
    commandName: string;
}

export class CommandSuggestionModal extends FuzzySuggestModal<SuggestElement> {
    private items: SuggestElement[];
    constructor(app: App) {
        super(app);

        let appex = app as AppExtension;
        let items: SuggestElement[] = [];
        for (let id in appex.commands.commands) {
            items.push({
                commandId: id,
                commandName: appex.commands.commands[id].name,
            })
        }
        this.items = items;
    }

    getItems(): SuggestElement[] {
        return this.items;
    }
    getItemText(item: SuggestElement): string {
        return item.commandName;
    }
    onChooseItem(item: SuggestElement, evt: MouseEvent | KeyboardEvent): void {
        let m = new NamingModal({
            app: this.app,
            command: item,
        });
        m.open();
    }
}

type NamingModalParams = {
    app: App,
    command: SuggestElement,
}
class NamingModal extends Modal {
    private command: SuggestElement;
    constructor(params: NamingModalParams) {
        let { app, command } = params;
        super(app);
        this.command = command;
    }

    onOpen() {
        let { contentEl } = this;
        contentEl.createEl('h2', { text: "Add alias" });

        contentEl.createSpan({ text: this.command.commandName });
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}
