import { Card, NumberPosition } from "./Card";
import { getRandomNumber } from "../utils/RandomValues/randomNumber";
import {
  InvalidRemoveValuesException,
  NotEnoughtSortedNumbersException,
  UserAlreadyHasCartelaException,
  UserDoesNotHaveCartelaException,
} from "./Errors/errors";

import crypto from "crypto";

export class BingoGame {
  /**
   * Singleton pattern
   */
  static instance: BingoGame;

  public static getInstance(): BingoGame {
    if (!BingoGame.instance) {
      BingoGame.instance = new BingoGame();
    }
    return BingoGame.instance;
  }

  premio?: string;

  bingoInitiazed: boolean = false;

  numberCountToBingo: number = 24;

  tokenGame: string = crypto.randomUUID();

  private users: Map<string, Card>;

  private sorted: number[];

  constructor(premio?: string) {
    this.users = new Map();
    this.sorted = [];
    this.bingoInitiazed = false;
    this.premio = premio;
    this.tokenGame = crypto.randomUUID();
  }

  exit() {
    this.premio = "";
    this.users = new Map();
    this.sorted = [];
    this.bingoInitiazed = false;
    this.tokenGame = "";
  }
  get getTokenGame() {
    return this.tokenGame;
  }

  sortNumber() {
    let newSorted: number;
    if (this.sorted.length === 75) {
      throw new Error("todos os números foram sorteados!");
    }
    do {
      newSorted = getRandomNumber();
    } while (this.sorted.includes(newSorted));
    this.sorted.push(newSorted);
    return newSorted;
  }

  createCard(userId: string): Card {
    if (this.users.get(userId)) throw new UserAlreadyHasCartelaException();
    const cartela = new Card(userId);
    this.users.set(userId, cartela);
    return cartela;
  }

  bingo(userId: string): boolean {
    const cartela = this.users.get(userId);

    if (!cartela) throw new UserDoesNotHaveCartelaException();

    if (this.sorted.length < this.numberCountToBingo)
      throw new NotEnoughtSortedNumbersException();

    if (cartela.getConfirmed.length >= this.numberCountToBingo) {
      return true;
    }

    return false;
  }

  gameInitialized() {
    return this.bingoInitiazed;
  }

  confirmNumberOnList(userId: string, value: number): boolean {
    if (!this.sorted.includes(value)) throw new InvalidRemoveValuesException();

    const cartela = this.users.get(userId);

    if (!cartela) throw new UserDoesNotHaveCartelaException();

    try {
      const position = cartela.getPosition(value);
    } catch {
      return false;
    }

    return true;
  }

  setPremio(premio: string) {
    this.premio = premio;
    this.bingoInitiazed = true;
  }

  get getPremio() {
    return this.premio;
  }

  get getUsers() {
    return this.users;
  }

  getUser(userId: string) {
    const cardUser = this.users.get(userId);
    return cardUser;
  }

  get getSortedNumbers() {
    return this.sorted;
  }
}
