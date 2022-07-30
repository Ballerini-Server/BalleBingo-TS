import { Card, NumberPosition } from './Card';
import { getRandomNumber } from '../utils/RandomValues/randomNumber';
import {
  InvalidRemoveValuesException,
  NotEnoughtSortedNumbersException,
  UserAlreadyHasCartelaException,
  UserDoesNotHaveCartelaException,
} from './Errors/errors';

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

  constructor(premio = '') {
    this.premio = premio;
    this.users = new Map();
    this.sorted = [];
  }

  restart(premio: string) {
    this.sorted = [];
    this.premio = premio;
    this.users = new Map();
  }

  /**
   * Nome do premio
   */
  premio?: string;
  /**
   * Map contento as cartelas dos ususários
   */
  private users: Map<string, Card>;
  /**
   * Lista de números sortidos
   */
  private sorted: number[];

  /**
   * Sorteia um novo número
   * @returns O novo número sorteado
   */
  sortNumber() {
    let newSorted: number;
    do {
      newSorted = getRandomNumber();
    } while (this.sorted.includes(newSorted));
    this.sorted.push(newSorted);
    return newSorted;
  }

  /**
   * Cria uma cartela para um userId e registra no jogo
   * @param userId Id do usuário para criar uma cartela
   * @returns a cartela do usuário
   *
   * @throws {UserAlreadyHasCartelaException} Usuário já possui um cartela
   */
  createCard(userId: string): Card {
    if (this.users.get(userId)) throw new UserAlreadyHasCartelaException();
    const cartela = new Card(userId);
    this.users.set(userId, cartela);
    return cartela;
  }

  /**
   * Valida se o usuário realmente completou o bingo
   * @param userId Id do ususário que disse bingo
   *
   * @throws {UserDoesNotHaveNumberException} Usuário não possui esse número na cartela
   * @throws {UserDoesNotHaveCartelaException} Usuário ainda não tem uma cartela
   * @throws {NotEnoughtSortedNumbersException} Não há números suficientes para bingo
   */
  bingo(userId: string): boolean {
    const cartela = this.users.get(userId);

    if (!cartela) throw new UserDoesNotHaveCartelaException();

    if (this.sorted.length < 24) throw new NotEnoughtSortedNumbersException();

    if (cartela.getConfirmed.length == 24) {
      return true;
    }

    return false;
  }

  /**
   * Remove um número que o usuário informou
   * @param userId Id do usuário para remover o número
   * @param value número para remover da cartela
   * @returns A posição que deve ser removida
   *
   * @throws {InvalidRemoveValuesException} Valor para remover ainda não foi sorteado
   * @throws {UserDoesNotHaveCartelaException} Usuário ainda não tem uma cartela
   * @throws {UserDoesNotHaveNumberException} Usuário não possui esse número na cartela
   */
  confirmNumberOnList(userId: string, value: number): NumberPosition {
    if (!this.sorted.includes(value)) throw new InvalidRemoveValuesException();

    const cartela = this.users.get(userId);

    if (!cartela) throw new UserDoesNotHaveCartelaException();

    return cartela.getPosition(value);
  }

  /**
   * Retorna o nome do premio
   */
  get getPremio() {
    return this.premio;
  }

  /**
   * Retorna o map com os usuários registrados no bingo
   */
  get getUsers() {
    return this.users;
  }

  /**
   * Retorna os números sorteados até o momento
   */
  get getSortedNumbers() {
    return this.sorted;
  }
}
