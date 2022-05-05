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
        const { containerEl } = this;

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
            .setDesc('*Obsolate*: Added useful commands. "Command Alias: Add command alias" does not require a manual reload of the plugin.')
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
                    this.plugin.addAliasSetting(aliasName, selectedCommandId);
                    await this.plugin.saveSettings();
                    this.display();
                }));

        // command detection
        containerEl.createEl('h3', { text: 'Command detection' });
        new Setting(containerEl)
            .setName('Maximum number of trials')
            .addSlider(slider => slider
                .setLimits(1, 10, 1)
                .setValue(this.plugin.settings.commandDetection.maxTry)
                .setDynamicTooltip()
                .onChange(async value => {
                    this.plugin.settings.commandDetection.maxTry = value;
                    await this.plugin.saveSettings();
                })
            );
        new Setting(containerEl)
            .setName('Trial interval (msec)')
            .addSlider(slider => slider
                .setLimits(100, 1000, 100)
                .setValue(this.plugin.settings.commandDetection.msecOfInterval)
                .setDynamicTooltip()
                .onChange(async value => {
                    this.plugin.settings.commandDetection.msecOfInterval = value;
                    await this.plugin.saveSettings();
                })
            );

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
