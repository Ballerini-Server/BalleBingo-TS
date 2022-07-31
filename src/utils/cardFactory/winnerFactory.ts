import { Canvas, loadImage, registerFont } from "canvas";
import { User } from "discord.js";

registerFont(process.cwd() + "/layout/font/Teko/Teko-Bold.ttf", {
  family: "Teko",
});

export async function winnerFactory(user: User) {
  const canvas = new Canvas(1920, 1000);
  const base = await loadImage("layout/vencedor/winner.png");
  const mask = await loadImage("layout/vencedor/mask.png");
  const avatar = await loadImage(user.avatarURL({ extension: "png" }));

  const context = canvas.getContext("2d");

  context.drawImage(base, 0, 0, 1920, 1000);

  const imageX = canvas.width / 2 - 277 / 2;
  const imageY = canvas.height / 2 - 28;

  context.beginPath();
  context.arc(imageX + 277 / 2, imageY + 277 / 2, 278 / 2, 0, Math.PI * 2);
  context.save();
  context.clip();
  context.drawImage(avatar, imageX, imageY, 277, 277);
  context.restore();

  context.font = '70px "Teko"';
  context.fillStyle = "#FFFAFA";
  context.textAlign = "center";
  context.fillText(user.tag, canvas.width / 2, imageY + 350);

  return canvas.toBuffer("image/png");
}
