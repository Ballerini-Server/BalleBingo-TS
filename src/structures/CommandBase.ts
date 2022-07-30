export abstract class CommandBase implements CommandType {
  name: string;

  description: string;

  permission: PermissionType;

  aliases?: string[];

  dm?: boolean;

  optionsSlash?: OpcionalCommandOptions[];

  run: RunFunction;
}
