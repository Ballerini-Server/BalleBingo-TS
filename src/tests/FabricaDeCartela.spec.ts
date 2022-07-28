import fs from 'fs';

import { Cartela } from "../Cartela";
import { FabricaDeCartela } from "../FabricaDeCartela";

const table = [
  [2, 5, 6, 8, 9],
  [10, 16, 22, 23, 27],
  [30, 32, null, 37, 38],
  [40, 42, 44, 47, 49],
  [51, 53, 55, 58, 60]
];

jest.mock('../utils/RandomValues/getFormatedTableNumbers', () => ({
  getFormatedTableNumbers: () => table
}))

describe('FabricaDeCartela', () => {
    it('should return value position', async() => {
        const cartela = new Cartela('fake-user-id');

        Object.defineProperty(cartela, 'getConfirmed', {
            get: () => [2, 9, 16, 37, 60],
        });

        FabricaDeCartela(cartela).then(buffer => {
            fs.writeFileSync('cartela.png', buffer);
        });
    });
});