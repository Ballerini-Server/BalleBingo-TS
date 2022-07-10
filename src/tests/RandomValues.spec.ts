import { getFormatedTableNumbers } from "../utils/RandomValues/getFormatedTableNumbers";

const especificList =
  [26, 3, 2, 9, 10, 45, 55, 63, 39, 48, 50, 12, 59, 40, 48, 15, 34, 20, 42, 38, 49, 58, 29, 17, 43];

jest.mock('../utils/RandomValues/getManyRandomNumbers', () => ({
  getManyRandomNumbers: () => especificList,
}))

describe('Format Table Values', () => {
  it('Should be able to sort and format random numbers', () => {
    const result = getFormatedTableNumbers();

    const sortedList = especificList.sort((a, b) => a - b);

    const firstRow = [sortedList[0], sortedList[1], sortedList[2], sortedList[3], sortedList[4]];
    const secondRow = [sortedList[5], sortedList[6], sortedList[7], sortedList[8], sortedList[9]];
    const thirdRow = [sortedList[10], sortedList[11], null, sortedList[13], sortedList[14]];
    const fourthRow = [sortedList[15], sortedList[16], sortedList[17], sortedList[18], sortedList[19]];
    const fifthRow = [sortedList[20], sortedList[21], sortedList[22], sortedList[23], sortedList[24]];

    expect(result[0]).toEqual(expect.arrayContaining(firstRow))
    expect(result[1]).toEqual(expect.arrayContaining(secondRow))
    expect(result[2]).toEqual(expect.arrayContaining(thirdRow))
    expect(result[3]).toEqual(expect.arrayContaining(fourthRow))
    expect(result[4]).toEqual(expect.arrayContaining(fifthRow))
  })
})
