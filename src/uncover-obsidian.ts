import { App, Command } from "obsidian";

export class AppExtension extends App {
    commands: {
        commands: CommandMap
    }
}

type CommandMap = {
    [key: string]: Command;
}
