import { App, FuzzySuggestModal, Modal } from "obsidian";
import { AppExtension } from "./uncover-obsidian";

interface CommandInfo {
    id: string;
    commandName: string;
}

export class CommandSuggestionModal extends FuzzySuggestModal<CommandInfo> {
    private items: CommandInfo[];
    constructor(app: App) {
        super(app);

        let appex = app as AppExtension;
        let items: CommandInfo[] = [];
        for (let id in appex.commands.commands) {
            items.push({
                id: id,
                commandName: appex.commands.commands[id].name,
            })
        }
        this.items = items;
    }

    getItems(): CommandInfo[] {
        return this.items;
    }
    getItemText(item: CommandInfo): string {
        return item.commandName;
    }
    onChooseItem(item: CommandInfo, evt: MouseEvent | KeyboardEvent): void {
        let m = new NamingModal({
            app: this.app,
            command: item,
        });
        m.open();
    }
}

type NamingModalParams = {
    app: App,
    command: CommandInfo,
}
class NamingModal extends Modal {
    private command: CommandInfo;
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
