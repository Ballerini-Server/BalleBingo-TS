import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
  TextChannel,
} from "discord.js";
import { BingoGame } from "../../structures/BingoGame";
import { CommandBase } from "../../structures/CommandBase";
import "dotenv/config";
export default {
  name: "initGame",

  description: "",

  permission: "admins",

  aliases: ["init"],

  run: async (message: Message) => {
    const args = message.content.split(/ +/);

    const channelId = args[1]?.replace(/<|#|!|>/g, "");

    const channel: TextChannel = message.guild.channels.cache.get(
      channelId
    ) as TextChannel;
    const PREFIX = process.env.PREFIX;

    if (!channel) {
      message.channel.send(
        `Opss, não encontrei o canal de texto! Digite o comando da seguinte forma: ${PREFIX}init <channel> <prêmio>`
      );
      return;
    }

    const premio = args.splice(2).join(" ");
    if (!premio) {
      return message.channel.send(
        `Opss, não existe um prêmio no comando! Digite o comando da seguinte forma: ${PREFIX}init <channel> <prêmio>`
      );
    }
    const bingoGame = BingoGame.getInstance();

    if (bingoGame.gameInitialized()) {
      return message.channel.send(
        `Um Jogo está em adamento! Use o comando de ${PREFIX}exit para finalizar o bingo atual (todas as cartelas serão apagadas)`
      );
    }

    bingoGame.setPremio(premio);
    try {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(bingoGame.getTokenGame + "_pegarcartela")
          .setLabel("PEGAR CARTELA")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(bingoGame.getTokenGame + "_sortear")
          .setLabel("SORTEAR PRIMEIRO NÚMERO")
          .setStyle(ButtonStyle.Secondary)
      );

      channel.send({
        embeds: [
          {
            title: "**Olá, Seja bem-vindo a mais uma edição do Ballebingo!**",
            description: `Dessa vez, melhoramos o antigo sistema que usamos no ano passado e agora você tem ainda mais facilidade!
Dentre algumas mudanças, agora você jogará com um sistema de botões e poderá ver apenas sua cartela no jogo. Vai funcionar assim:

**Prêmio dessa rodada do Bingo: ${premio}**

Clique no botão para pegar uma cartela, após a confirmação, espere o bingo começar por um dos nossos apresentadores.
Junto com a mensagem de número sorteado haverá um botão para você marcar esse número na sua cartela (lembrando que você precisa ter o número para poder marcar ele)
Ainda na mesma mensagem você pode acompanhar como a sua cartela está ficando, ninguém além de você poderá ver a sua cartela.
Assim que chegar no 24° número, aparecerá um botão para gritar bingo, caso você tenha preenchido todos os números. (cuidado para não usar desnecessariamente! ps:o Tauz avisou)

**E que a sorte, esteja com todos vocês!**
`,
            image: { url: "https://imgur.com/OBzOkMt.png" },
          },
        ],
        components: [row as any],
      });
    } catch {
      message.channel.send(
        "Opss, aconteceu um erro ao enviar (eu não consigo enviar mensagens no chat especificado)"
      );
    }
  },
} as CommandBase;
