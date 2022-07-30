import { Canvas, loadImage } from 'canvas';

import type { Card } from '../../structures/Card';

export async function cardFactory(cartela: Card) {
  const canvas = new Canvas(512, 600);

  const context = canvas.getContext('2d');

  const layout = await loadImage('layout/baseCard/layout.png');

  context.drawImage(layout, 0, 0, 512, 600);

  const rows = cartela.getValues;

  const confirmed = cartela.getConfirmed;

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const value = row[columnIndex];

      if (value && !confirmed.includes(value)) {
        const number = await loadImage(
          `layout/numbers/numero-${value}.png`
        );

        context.drawImage(number, 55 + columnIndex * 85, 125 + rowIndex * 92, 60, 60);
      }
    }
  }

  return canvas.toBuffer('image/png');
}
