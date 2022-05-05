import { App, FuzzySuggestModal, Modal, Notice, Setting } from "obsidian";
import CommandAliasPlugin from "./main";
import { AppExtension } from "./uncover-obsidian";

interface CommandInfo {
    id: string;
    name: string;
}

export class CommandSuggestionModal extends FuzzySuggestModal<CommandInfo> {
    private plugin: CommandAliasPlugin;
    private items: CommandInfo[];
    constructor(app: App, plugin: CommandAliasPlugin) {
        super(app);
        this.plugin = plugin;

        const appex = app as AppExtension;
        const items: CommandInfo[] = [];
        for (const id in appex.commands.commands) {
            // Don't loop aliases.
            if (id.startsWith('obsidian-command-alias-plugin:alias:')) {
                continue;
            }
            items.push({
                id: id,
                name: appex.commands.commands[id].name,
            })
        }
        this.items = items;
    }

    getItems(): CommandInfo[] {
        return this.items;
    }
    getItemText(item: CommandInfo): string {
        return item.name;
    }
    onChooseItem(item: CommandInfo, evt: MouseEvent | KeyboardEvent): void {
        const m = new NamingModal({
            app: this.app,
            plugin: this.plugin,
            command: item,
        });
        m.open();
    }
}

type NamingModalParams = {
    app: App,
    plugin: CommandAliasPlugin,
    command: CommandInfo,
}
class NamingModal extends Modal {
    private plugin: CommandAliasPlugin;
    private command: CommandInfo;
    constructor(params: NamingModalParams) {
        const { app, plugin, command } = params;
        super(app);
        this.plugin = plugin;
        this.command = command;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: `Add alias: ${this.command.name}` });

        let aliasName = ""
        new Setting(contentEl)
            .setName('Naming alias')
            .addText(text => text
                .setPlaceholder('add alias')
                .onChange(value => {
                    aliasName = value.trim();
                }))
            .addButton(button => button
                .setButtonText('Add')
                .onClick(async e => {
                    if (aliasName === "") {
                        new Notice('alias name is empty');
                        return;
                    }
                    this.plugin.addAliasSetting(aliasName, this.command.id);
                    await this.plugin.saveSettings();
                    this.close();
                    this.plugin.unload();
                    this.plugin.load();
                }));
        contentEl.find('input').focus();
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
