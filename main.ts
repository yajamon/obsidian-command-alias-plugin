import { App, Command, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

class AppExtension extends App {
	commands: {
		commands: CommandMap
	}
}

type CommandMap = {
	[key: string]: Command;
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log('loading plugin');

		let app = this.app as AppExtension;

		await this.loadSettings();

		this.addCommand({
			id: 'alias:app:toggle-right-sidebar',
			name: '右のサイドバーを開閉',
			callback: () => {
				app.commands.commands['app:toggle-right-sidebar'].callback();
			}
		});

		this.addCommand({
			id: 'open-sample-modal',
			name: 'Open Sample Modal',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						// do something
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		let app = this.app as AppExtension;
		let options: Record<string, string> = { "": "--- command list ---" };
		for (const key in app.commands.commands) {
			if (Object.prototype.hasOwnProperty.call(app.commands.commands, key)) {
				const command = app.commands.commands[key];
				options[key] = command.name;
			}
		}


		containerEl.empty();

		containerEl.createEl('h2', { text: 'Command alias' });

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue('')
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
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
			.addText(text => text
				.setPlaceholder('alias name')
				.onChange(value => {
					aliasName = value;
				}))
			.addButton(button => button
				.setButtonText('Add')
				.onClick(e => {
					if (selectedCommandId == "" || aliasName == "") {
						return;
					}
					console.log('Add alias:', aliasName, "id:", selectedCommandId);
				}));
	}
}
