import {
  UserDoesNotCompleteException,
  UserDoesNotHaveNumberException,
} from './Errors/errors';
import {
  getFormatedTableNumbers,
  Table,
} from '../utils/RandomValues/getFormatedTableNumbers';
import { cardFactory } from '../utils/cardFactory/cardFactory';

export type NumberPosition = {
  columnIndex: number;
  rowIndex: number;
};

export class Card {
  /**
   * Valores da cartela do usuário
   */
  private values: Table;
  /**
   * Valores que o usuário confirmou
   */
  private confirmedValues: number[];
  /**
   * Id do dono da cartela
   */
  private userId: string;
  constructor(userId: string) {
    this.userId = userId;
    this.confirmedValues = [];
    this.values = getFormatedTableNumbers();
  }
  /**
   * Devolve os valores da cartela do usuário
   */
  get getValues() {
    return this.values;
  }
  /**
   * Devolve os valores confirmados da cartela do usuário
   */
  get getConfirmed() {
    return this.confirmedValues;
  }

  /**
   * Devolve o Id do usuário
   */
  get getUserId() {
    return this.userId;
  }

  /**
   * Devolve a posição do valor na cartela do usuário
   * @throws {UserDoesNotHaveNumberException} Usuário não possui esse número na cartela
   */
  getPosition(value: number) {
    const result = this.values.reduce<NumberPosition | undefined>(
      (result, row, rowIndex) => {
        if (result) return result;

        const columnIndex = row.findIndex((number) => number === value);

        if (columnIndex < 0 && !result) return undefined;
        if (row[columnIndex])
          this.confirmedValues.push(Number(row[columnIndex]));
        return { rowIndex, columnIndex };
      },
      undefined
    );
    if (!result) throw new UserDoesNotHaveNumberException(value);

    return result;
  }

  /**
   * Devolve a posição do valor na cartela do usuário
   * @throws {UserDoesNotCompleteException} Usuário não completou a cartela
   */
  getAllPositions(values: number[]): NumberPosition[] {
    const result = values
      .map((value) => {
        try {
          return this.getPosition(value);
        } catch {
          return null;
        }
      })
      .filter(Boolean) as NumberPosition[];

    if (result.length < this.values.flat().length - 1)
      throw new UserDoesNotCompleteException();

    return result;
  }

  getBufferImageCard() {
    return cardFactory(this);
  }
}
