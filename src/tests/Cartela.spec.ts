import { Cartela } from "../Cartela"
import { UserDoesNotCompleteException, UserDoesNotHaveNumberException } from "../Cartela/Errors"

const table = [
  [2, 5, 6, 8, 9],
  [10, 15, 22, 23, 27],
  [30, 32, null, 37, 38],
  [40, 42, 44, 47, 49],
  [51, 53, 55, 58, 60]
];

jest.mock('../utils/RandomValues/getFormatedTableNumbers', () => ({
  getFormatedTableNumbers: () => table
}))

describe('Cartela', () => {
  it('should return value position', () => {
    const cartela = new Cartela('fake-user-id');

    expect(cartela.getPosition(8)).toEqual(expect.objectContaining({
      columnIndex: 3,
      rowIndex: 0
    }))
  })

  it('should return update confirmed values on getPosition', () => {
    const cartela = new Cartela('fake-user-id');

    cartela.getPosition(8)

    expect(cartela.getConfirmed).toEqual(expect.arrayContaining([8]))
  })

  it('should throw UserDoesNotHaveNumberException when user does not have the passed value', () => {
    const cartela = new Cartela('fake-user-id');

    expect(() => cartela.getPosition(3)).toThrow(UserDoesNotHaveNumberException);
  })

  it('should throw UserDoesNotCompleteException when there is missing 1 value', () => {
    const cartela = new Cartela('fake-user-id');

    const [_unused, ...values] = table.flat().filter(Boolean) as number[];

    const sortedList = [...values, 4]

    expect(() =>
      cartela.getAllPositions(sortedList)
    ).toThrow(UserDoesNotCompleteException)
  })
})
