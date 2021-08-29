import { App, FuzzySuggestModal } from "obsidian";

interface SuggestElement {
    commandId: string;
    commandName: string;
}

export class CommandSuggestionModal extends FuzzySuggestModal<SuggestElement> {
    private items: SuggestElement[];
    constructor(app: App) {
        super(app);
        this.items = [];
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
