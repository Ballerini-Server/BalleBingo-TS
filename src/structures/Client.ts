import { Client } from 'discord.js';
import { CommandBase } from './CommandBase';
import 'dotenv/config';
import commandHandler from '../commands/commandHandler';
import eventHandler from '../events/eventHandler';

export class BalleBingo extends Client {
  static instance: BalleBingo;

  public static getInstance(): BalleBingo {
    if (!BalleBingo.instance) {
      BalleBingo.instance = new BalleBingo();
    }
    return BalleBingo.instance;
  }

  constructor() {
    super({
      intents: [
        'Guilds',
        'GuildMembers',
        'GuildMessages',
        'GuildMessageTyping',
        'GuildMessageReactions',
        'MessageContent',
      ],
    });
  }

  private commands: CommandBase[] = [];

  public async loadCommands(): Promise<void> {
    await commandHandler();
  }

  public addCommand(command: CommandBase) {
    this.commands.push(command);
  }

  public getOneCommand(commandToGet: string): CommandBase {
    const command = this.commands.find(
      (c) =>
        c.name.toLowerCase() === commandToGet ||
        c.aliases?.includes(commandToGet)
    );
    return command;
  }

  public async loadEvents(): Promise<void> {
    await eventHandler();
  }

  public getAllCommands(): CommandBase[] {
    return this.commands;
  }

  public async init() {
    await this.login(process.env.TOKEN);
  }
}
