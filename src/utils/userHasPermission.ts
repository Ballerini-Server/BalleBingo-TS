import { Message } from 'discord.js';

export function userHasPermission(
  message: Message,
  commandToRun: CommandType
): boolean {
  if (commandToRun.permission === 'admins') {
    const idsOwnersBallebingo = process.env.USERS?.split('|');

    if (idsOwnersBallebingo?.includes(message.author.id)) {
      return true;
    }
    return false;
  }
  return true;
}
