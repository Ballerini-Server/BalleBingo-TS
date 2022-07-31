import { Message } from "discord.js";

export function sendMessageGameInitialized(message: Message) {
  message.channel.send(
    "Hey! você está tentando iniciar um bingo que já está rolando, caso queira podes reiniciar com outro comando"
  );
}
