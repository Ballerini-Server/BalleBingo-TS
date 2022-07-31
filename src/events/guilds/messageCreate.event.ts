import "dotenv/config";
import { Message } from "discord.js";
import { BalleBingo } from "../../structures/Client";
import { EventBase } from "../../structures/Event";
import { userHasPermission } from "../../utils/userHasPermission";
import { sendMessageWithoutPermission } from "../../view/embeds/sendMessageWithoutPermission";
import { BingoGame } from "../../structures/BingoGame";
import { sendMessageGameInitialized } from "../../view/embeds/sendMessageGameInitialized";

export default new EventBase("messageCreate", (message: Message) => {
  if (message.author.bot) return;

  if (message.content === "") return;
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
    const bingoGame = BingoGame.getInstance();

    if (!bingoGame.gameInitialized()) {
      commandToRun.run(message);
      return;
    }
    if (commandToRun.name === "exit") {
      commandToRun.run(message);
      return;
    }

    sendMessageGameInitialized(message);
  } else {
    sendMessageWithoutPermission(message);
  }
  message.delete();
});
