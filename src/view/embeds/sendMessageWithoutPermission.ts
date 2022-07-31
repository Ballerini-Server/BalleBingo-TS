import { Message } from "discord.js";

export function sendMessageWithoutPermission(message: Message) {
  message.channel.send("Hey! você não pode iniciar um novo game");
}
