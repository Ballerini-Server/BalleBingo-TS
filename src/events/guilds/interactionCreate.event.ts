import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Interaction,
} from "discord.js";
import { BingoGame } from "../../structures/BingoGame";
import { EventBase } from "../../structures/Event";
import "dotenv/config";
import { RateLimit } from "../../structures/RateLimit";
import { Card } from "../../structures/Card";
import { winnerFactory } from "../../utils/cardFactory/winnerFactory";

export default new EventBase(
  "interactionCreate",
  async (interaction: Interaction) => {
    const buttonInteraction = interaction as ButtonInteraction;
    if (!buttonInteraction) return;

    const [tokenGame, buttonID] = buttonInteraction.customId.split("_");

    const userId = buttonInteraction.user.id;
    const bingoGame = BingoGame.getInstance();

    if (!(tokenGame === bingoGame.getTokenGame)) return;

    if (!bingoGame.gameInitialized()) {
      return buttonInteraction.reply({
        content: "Hey! Espere o novo bingo começar.",
        ephemeral: true,
      });
    }

    if (buttonID === "sortear") {
      const users = process.env.USERS?.split("|");

      if (users.includes(userId)) {
        let number: number;
        try {
          number = bingoGame.sortNumber();
        } catch {
          return buttonInteraction.reply({
            content: "Todos os números foram sorteados!",
          });
        }

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(bingoGame.getTokenGame + "_sortear")
            .setLabel("SORTEAR")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(bingoGame.getTokenGame + "_pegarcartela")
            .setLabel("VER/PEGAR SUA CARTELA")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(bingoGame.getTokenGame + "_removernumero" + number)
            .setLabel("EU TENHO!")
            .setStyle(ButtonStyle.Primary)
        );

        if (bingoGame.getSortedNumbers.length > 24) {
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(bingoGame.getTokenGame + "_bingo")
              .setLabel("GRITAR BINGO!")
              .setStyle(ButtonStyle.Danger)
          );
        }

        return buttonInteraction.reply({
          content: "Número sorteado: " + number,
          components: [row as any],
        });
      } else {
        return buttonInteraction.reply({
          content: "Você não é um admin, pessoa engraçadinha :yawning_face: 👮‍♀️",
          ephemeral: true,
        });
      }
    }
    await buttonInteraction.deferReply({ ephemeral: true });

    if (buttonID === "pegarcartela") {
      if (RateLimit.getInstance().verifyUserGetCard(userId)) {
        return buttonInteraction.followUp({
          content: `Calma ai, espere ${
            RateLimit.getInstance().getSecondsCard
          } segundos para ver a cartela novamente :yawning_face: :stuck_out_tongue_winking_eye:`,
          ephemeral: true,
        });
      }

      let card = bingoGame.getUser(userId);

      if (!card) {
        card = bingoGame.createCard(userId);
      }
      const bufferCard = await card.getBufferImageCard();

      return buttonInteraction.followUp({
        content: "Esta é sua cartela!",
        ephemeral: true,
        files: [new AttachmentBuilder(bufferCard, { name: "cartela.png" })],
      });
    }

    if (/removernumero/.test(buttonID)) {
      const userbingo = bingoGame.getUser(userId);
      const number = parseInt(buttonID.replace(/removernumero/, ""));

      if (!userbingo) {
        return buttonInteraction.followUp({
          content: "Pegue uma cartela primeiro! :pencil:",
          ephemeral: true,
        });
      }

      if (bingoGame.confirmNumberOnList(userId, number)) {
        buttonInteraction.followUp({ content: "Marcado!", ephemeral: true });
      } else {
        return buttonInteraction.followUp({
          content:
            "Você não tem esse número pessoa engraçadinha! :face_with_monocle:",
          ephemeral: true,
        });
      }
    }

    if (buttonID === "bingo") {
      let userbingo: Card;
      try {
        userbingo = bingoGame.getUser(userId);
      } catch {
        return buttonInteraction.followUp({
          content: "Pegue uma cartela primeiro! :pencil:",
          ephemeral: true,
        });
      }

      if (RateLimit.getInstance().verifyUserGetBingo(userId)) {
        return buttonInteraction.followUp({
          content:
            "Espere sua punição por ter gritado bingo falso acabar hahaaha :joy::smiling_imp:",
        });
      }
      let userWinner = false;
      try {
        userWinner = bingoGame.bingo(userId);
      } catch {
        return buttonInteraction.followUp({
          content: "Aconteceu um erro interno, desculpe pelo transtorno.",
          ephemeral: true,
        });
      }

      if (userWinner) {
        bingoGame.exit();

        const bufferWinner = await winnerFactory(interaction.user);
        const image = new AttachmentBuilder(bufferWinner, {
          name: "winner.png",
        });

        await buttonInteraction.channel.send({
          content: "**Ganhador: **" + interaction.user.toString(),
          files: [image],
        });

        return buttonInteraction.followUp({
          content: "Bingo!",
        });
      } else {
        return buttonInteraction.followUp({
          content: `Calma lá pessoa engraçadinha! Você não completou todos os números e só poderar gritar bingo daqui ${
            RateLimit.getInstance().getSecondsBingo
          } segundos! hahaaha :joy::smiling_imp:`,
          ephemeral: true,
        });
      }
    }
  }
);
