import { App, PluginSettingTab, Setting } from "obsidian";
import { AppExtension } from "./uncover-obsidian";
import CommandAliasPlugin from "./main";

export class CommandAliasPluginSettingTab extends PluginSettingTab {
    plugin: CommandAliasPlugin;

    constructor(app: App, plugin: CommandAliasPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        let app = this.app as AppExtension;
        let options: Record<string, string> = { "": "--- command list ---" };
        for (const key in app.commands.commands) {
            if (!Object.prototype.hasOwnProperty.call(app.commands.commands, key)) {
                continue;
            }
            if (key.startsWith('obsidian-command-alias-plugin:')) {
                continue;
            }

            const command = app.commands.commands[key];
            options[key] = command.name;
        }


        containerEl.empty();

        containerEl.createEl('h2', { text: 'Command alias' });

        let selectedCommandId = "";
        new Setting(containerEl)
            .setName('Select command')
            .addDropdown(dropdown => dropdown
                .addOptions(options)
                .onChange(value => {
                    console.log("select command");
                    selectedCommandId = value;
                }));
        let aliasName = "";
        new Setting(containerEl)
            .setName('Add alias')
            .setDesc('Reload is required to apply.')
            .addText(text => text
                .setPlaceholder('alias name')
                .onChange(value => {
                    aliasName = value.trim();
                }))
            .addButton(button => button
                .setButtonText('Add')
                .onClick(async e => {
                    if (selectedCommandId == "" || aliasName == "") {
                        return;
                    }
                    let aliasId = Date.now().toString();
                    console.log('Add id:', aliasId, 'alias:', aliasName, "command:", selectedCommandId);
                    this.plugin.settings.aliases[aliasId] = {
                        name: aliasName,
                        commandId: selectedCommandId,
                    }
                    await this.plugin.saveSettings();
                    this.display();
                }));

        // remove alias
        containerEl.createEl('h3', { text: 'Register aliases' });

        for (const aliasId in this.plugin.settings.aliases) {
            if (!Object.prototype.hasOwnProperty.call(this.plugin.settings.aliases, aliasId)) {
                continue;
            }
            const alias = this.plugin.settings.aliases[aliasId];
            const command = app.commands.commands[alias.commandId];
            const commandName = command.name || 'command missing';
            new Setting(containerEl)
                .setName(alias.name)
                .setDesc(commandName)
                .addButton(button => button
                    .setButtonText('Remove')
                    .onClick(async e => {
                        delete this.plugin.settings.aliases[aliasId];
                        await this.plugin.saveSettings();
                        this.display();
                    }));
        }
    }
}
