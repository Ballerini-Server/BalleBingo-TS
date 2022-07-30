import { ApplicationCommandOptions, CommandInteraction, Message } from 'eris';

declare global {
  type RunFunction = (params: Message | CommandInteraction) => void;

  type OpcionalCommandOptions = ApplicationCommandOptions;

  type CommandType = {
    name: string;
    description: string;
    permission: PermissionType;
    aliases?: string[];
    dm?: boolean;
    optionsSlash?: OpcionalCommandOptions[];
    run: RunFunction;
  };
}
export {};
