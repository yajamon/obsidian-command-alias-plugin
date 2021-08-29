import { App, FuzzySuggestModal } from "obsidian";
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
        throw new Error("Method not implemented.");
    }
}
