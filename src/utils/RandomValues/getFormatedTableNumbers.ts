import { getManyRandomNumbers } from "./getManyRandomNumbers";

export type Rows = (number | null)[];
export type Table = Rows[]

export function getFormatedTableNumbers() {
  const randomNumbers = getManyRandomNumbers(25);
  const sortedList = randomNumbers.sort((a, b) => a - b);

  return sortedList.reduce((accumulator, number, index) => {
    const column = index % 5;
    const line = Math.floor(index / 5);
    if (!accumulator[line])
      accumulator[line] = [];
    if (index === 12) {
      accumulator[line][column] = null;
      return accumulator;
    }
    accumulator[line][column] = number;

    return accumulator;
  }, [] as Table)
}
