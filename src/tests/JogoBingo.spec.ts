import { UserDoesNotCompleteException } from "../Cartela/Errors";
import { JogoBingo } from "../JogoBingo";
import { InvalidRemoveValuesException, NotEnoughtSortedNumbersException, UserAlreadyHasCartelaException, UserDoesNotHaveCartelaException } from "../JogoBingo/Errors";

const { getRandomNumber } = jest.requireActual('../utils/RandomValues/randomNumber')
const { getFormatedTableNumbers } = jest.requireActual('../utils/RandomValues/getFormatedTableNumbers')

const mockGetRandomNumber = jest.fn();
const mockGetManyRandomValues = jest.fn();

const randomNumberNotInList = (values: number[]) => () => {
  let randomNumber: number;
  do {
    randomNumber = getRandomNumber();
  } while (values.includes(randomNumber));
  return randomNumber;
}

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

jest.mock('../utils/RandomValues/randomNumber', () => {
  return {
    getRandomNumber: () => mockGetRandomNumber()
  }
})

describe('JogoBingo', () => {
  beforeEach(() => {
    mockGetRandomNumber.mockReturnValue(getRandomNumber());
    mockGetManyRandomValues.mockReturnValue(getFormatedTableNumbers());
  })

  describe('/sortNumber', () => {
    it('should add a number to sorted', () => {
      const jogoBingo = new JogoBingo();
      mockGetRandomNumber.mockReturnValue(7)
      const sortedNumber = jogoBingo.sortNumber();
      expect(jogoBingo.getSortedNumbers).toEqual(expect.arrayContaining([7]))
      expect(sortedNumber).toEqual(7)
    })

    it('should not repeat sorted number', () => {
      const jogoBingo = new JogoBingo();
      mockGetRandomNumber
        .mockReturnValueOnce(7)
        .mockReturnValueOnce(7)
        .mockReturnValueOnce(9);
      jogoBingo.sortNumber();
      expect(jogoBingo.sortNumber()).not.toEqual(7)
    })
  })

  describe('/createTable', () => {
    it('should create a table for userId', () => {
      const jogoBingo = new JogoBingo();
      const fakeUserId = 'fake-user-id';
      const createdCartela = jogoBingo.createTable(fakeUserId);

      const cartelas = jogoBingo.getUsers;

      expect(cartelas.get(fakeUserId))
        .toEqual(expect.objectContaining(createdCartela))
    })

    it('should throw UserAlreadyHasCartelaException on try to create table for the same user', () => {
      const jogoBingo = new JogoBingo();
      const fakeUserId = 'fake-user-id';
      jogoBingo.createTable(fakeUserId);

      expect(() => jogoBingo.createTable(fakeUserId))
        .toThrow(UserAlreadyHasCartelaException)
    })
  })

  describe('/removeNumber', () => {
    it('should return table position when user has number value', () => {
      const jogoBingo = new JogoBingo();
      const fakeUserId = 'fake-user-id';
      mockGetManyRandomValues.mockReturnValue(table);

      jogoBingo.createTable(fakeUserId);
      mockGetRandomNumber.mockReturnValue(5)

      jogoBingo.sortNumber()

      expect(jogoBingo.removeNumber(fakeUserId, 5))
        .toEqual(expect.objectContaining({
          columnIndex: 1,
          rowIndex: 0
        }))
    })

    it('should throw InvalidRemoveValuesException when user pass value that was not sorted', () => {
      const jogoBingo = new JogoBingo();
      const fakeUserId = 'fake-user-id';
      mockGetManyRandomValues.mockReturnValue(table);

      jogoBingo.createTable(fakeUserId);

      expect(() => jogoBingo.removeNumber(fakeUserId, 5))
        .toThrow(InvalidRemoveValuesException)
    })

    it('should throw UserDoesNotHaveCartelaException when user does not has cartela', () => {
      const jogoBingo = new JogoBingo();
      const fakeUserId = 'fake-user-id';

      mockGetRandomNumber.mockReturnValue(5)
      jogoBingo.sortNumber()

      expect(() => jogoBingo.removeNumber(fakeUserId, 5))
        .toThrow(UserDoesNotHaveCartelaException)
    })
  })

  describe('/removeAllNumbers', () => {
    it('should throw UserDoesNotHaveCartelaException when user does not has cartela', () => {
      const jogoBingo = new JogoBingo();
      const fakeUserId = 'fake-user-id';

      expect(() => jogoBingo.removeAllNumbers(fakeUserId))
        .toThrow(UserDoesNotHaveCartelaException)
    })
  })

  describe('/bingo', () => {
    it('Should return all positions from user when is bingo', () => {
      const jogoBingo = new JogoBingo();
      const fakeUserId = 'fake-user-id';
      mockGetManyRandomValues.mockReturnValue(table);
      jogoBingo.createTable(fakeUserId);

      mockGetRandomNumber.mockReturnValueOnce(1)
      jogoBingo.sortNumber()

      mockGetRandomNumber.mockReturnValueOnce(63)
      jogoBingo.sortNumber()

      const values = table.flat().filter(Boolean) as number[];

      values.forEach((value) => {
        if (value !== 0)
          mockGetRandomNumber.mockReturnValueOnce(value)
        else
          mockGetRandomNumber.mockReturnValueOnce(4)
        jogoBingo.sortNumber()
      })

      function* getAllExpectedPositions() {
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            if (j !== 2 && i !== 2)
              yield {
                columnIndex: i,
                rowIndex: j
              }
          }
        }
      }

      const expectedList = [...getAllExpectedPositions()];

      expect(jogoBingo.bingo(fakeUserId)).toEqual(expect.arrayContaining(expectedList))
    })

    it('should throw UserDoesNotCompleteException when there is missing 1 value', () => {
      const jogoBingo = new JogoBingo();
      const fakeUserId = 'fake-user-id';
      mockGetManyRandomValues.mockReturnValue(table);
      jogoBingo.createTable(fakeUserId);

      const values = table.flat().filter(Boolean) as number[];

      mockGetRandomNumber.mockReturnValueOnce(randomNumberNotInList(values));
      jogoBingo.sortNumber()

      values.filter((value) => value !== 2).forEach((value) => {
        mockGetRandomNumber.mockReturnValueOnce(value);
        jogoBingo.sortNumber()
      })

      expect(() => {
        jogoBingo.bingo(fakeUserId)
      }).toThrow(UserDoesNotCompleteException)
    })

    it('should throw NotEnoughtSortedNumbersException when there is not enought sorted values', () => {
      const jogoBingo = new JogoBingo();
      const fakeUserId = 'fake-user-id';
      mockGetManyRandomValues.mockReturnValue(table);
      jogoBingo.createTable(fakeUserId);

      const values = table.flat().filter(Boolean) as number[];

      values.filter((value) => value !== 2).forEach((value) => {
        mockGetRandomNumber.mockReturnValueOnce(value);
        jogoBingo.sortNumber()
      })

      expect(() => {
        jogoBingo.bingo(fakeUserId)
      }).toThrow(NotEnoughtSortedNumbersException)
    })

    it("should throw UserDoesNotHaveCartelaException when user doesn't has cartela", () => {
      const jogoBingo = new JogoBingo();
      const fakeUserId = 'fake-user-id-hasnt-cartela';

      expect(() => {
        jogoBingo.bingo(fakeUserId);
      }).toThrow(UserDoesNotHaveCartelaException)
    })
  })
})
