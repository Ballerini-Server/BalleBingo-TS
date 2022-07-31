import {
  UserDoesNotCompleteException,
  UserDoesNotHaveNumberException,
} from "./Errors/errors";
import {
  getFormatedTableNumbers,
  Table,
} from "../utils/RandomValues/getFormatedTableNumbers";
import { cardFactory } from "../utils/cardFactory/cardFactory";

export type NumberPosition = {
  columnIndex: number;
  rowIndex: number;
};

export class Card {
  private values: Table;

  private confirmedValues: number[];

  private userId: string;
  constructor(userId: string) {
    this.userId = userId;
    this.confirmedValues = [];
    this.values = getFormatedTableNumbers();
  }
  get getValues() {
    return this.values;
  }

  get getConfirmed() {
    return this.confirmedValues;
  }

  get getUserId() {
    return this.userId;
  }

  getPosition(value: number) {
    const result = this.values.reduce<NumberPosition | undefined>(
      (result, row, rowIndex) => {
        if (result) return result;

        const columnIndex = row.findIndex((number) => number === value);

        if (columnIndex < 0 && !result) return undefined;
        if (row[columnIndex] && !this.confirmedValues.includes(row[columnIndex]))
          this.confirmedValues.push(Number(row[columnIndex]));
        return { rowIndex, columnIndex };
      },
      undefined
    );
    if (!result) throw new UserDoesNotHaveNumberException(value);

    return result;
  }

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

  async getBufferImageCard() {
    return await cardFactory(this);
  }
}
