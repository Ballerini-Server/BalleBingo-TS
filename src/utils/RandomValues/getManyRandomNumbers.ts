import { getRandomNumber } from "./randomNumber";

export function getManyRandomNumbers(amount: number) {
  const list: number[] = [];
  for (let index = 0; index < amount; ) {
    const newNumber = getRandomNumber();
    if (!list.includes(newNumber)) {
      list.push(newNumber);
      index++;
    }
  }
  return list;
}
