import { Canvas } from 'canvas';

import { getCanvasImage } from '../CanvasImages/getCanvasImages';

import type { Card } from '../../structures/Card';

export async function cardFactory(cartela: Card) {
  const canvas = new Canvas(512, 600);

  const context = canvas.getContext('2d');

  const layout = await getCanvasImage('layout/baseCard/layout.png');

  context.drawImage(layout, 0, 0, 512, 600);

  const rows = cartela.getValues;

  let coordinateY = 125;

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    if (rowIndex > 0) {
      coordinateY += 92;
    }

    const row = rows[rowIndex];

    let coordinateX = 55;

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const value = row[columnIndex];

      if (value) {
        const number = await getCanvasImage(
          `layout/numbers/numero-${value}.png`
        );

        context.drawImage(number, coordinateX, coordinateY, 60, 60);
      }

      coordinateX += 85;
    }
  }

  const confirmed = cartela.getConfirmed;

  if (confirmed.length > 0) {
    const x = await getCanvasImage('layout/numbers/x.png');

    for (let value of confirmed) {
      const { columnIndex, rowIndex } = cartela.getPosition(value);

      context.drawImage(
        x,
        55 + columnIndex * 85 + 10,
        125 + rowIndex * 92 + 10,
        40,
        40
      );
    }
  }

  return canvas.toBuffer('image/png');
}
