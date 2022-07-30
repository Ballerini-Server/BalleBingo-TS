import 'dotenv/config';
import { Message } from 'discord.js';
import { BalleBingo } from '../../structures/Client';
import { EventBase } from '../../structures/Event';
import { userHasPermission } from '../../utils/userHasPermission';

export default new EventBase('messageCreate', (message: Message) => {
  if (message.author.bot) return;

  if (message.content === '') return;
  if (!message.content.startsWith(process.env.PREFIX)) return;

  const args = message.content.slice(1).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const ballebingo = BalleBingo.getInstance();
  const commandToRun = ballebingo
    .getAllCommands()
    .find(
      (command) =>
        command.name.toLowerCase() === commandName ||
        command.aliases?.includes(commandName)
    );
  if (!commandToRun) return;

  const userPermission: boolean = userHasPermission(message, commandToRun);
  if (userPermission) {
    commandToRun.run(message);
  } else {
    /*TODO sendMessageWithoutPermission(message, commandToRun.permission); */
  }
  message.delete();
});
