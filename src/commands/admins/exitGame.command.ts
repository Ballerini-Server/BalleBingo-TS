import { Message } from "discord.js";
import { BingoGame } from "../../structures/BingoGame";
import { CommandBase } from "../../structures/CommandBase";

export default {
  name: "exit",

  description: "",

  permission: "admins",

  aliases: ["exit"],

  run: async (message: Message) => {
    const bingoGame = BingoGame.getInstance();

    bingoGame.exit();

    message.channel.send(
      "O Bingo foi encerrado de propósito por : " + message.author.tag
    );
  },
} as CommandBase;
