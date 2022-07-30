import path from 'path';
import { Dirent, readdirSync } from 'fs';
import { CommandBase } from '../structures/CommandBase';
import { BalleBingo } from '../structures/Client';

const commandFolders = ['admins', 'players'];

function recursiveImport(folder: string) {
  const folderPath = path.resolve(__dirname, folder);

  let commandFiles: Dirent[];
  try {
    commandFiles = readdirSync(folderPath, { withFileTypes: true });
  } catch {}
  if (commandFiles) {
    commandFiles.forEach(async (file) => {
      if (file.isDirectory()) {
        recursiveImport(path.join(folder, file.name));

        return;
      }

      if (!/[.command.js]|[.command.ts]$/.test(file.name)) return;
      const name = `./${path.join('.', folder, file.name).replace(/\\/g, '/')}`;

      try {
        const command = (await import(`${name}`)).default as CommandBase;
        const ballebingo = BalleBingo.getInstance();

        ballebingo.addCommand(command);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

async function commandHandler(): Promise<void> {
  return new Promise((resolve) => {
    if (commandFolders) {
      commandFolders.forEach((folder) => {
        recursiveImport(folder);
      });
    }

    resolve();
  });
}

export default commandHandler;
