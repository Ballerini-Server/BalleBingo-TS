import { Cartela, NumberPosition } from "../Cartela";
import { getRandomNumber } from "../utils/RandomValues/randomNumber";
import {
  InvalidRemoveValuesException,
  NotEnoughtSortedNumbersException,
  UserAlreadyHasCartelaException,
  UserDoesNotHaveCartelaException
} from "./Errors";

export class JogoBingo {
  /**
   * Nome do premio
   */
  premio?: string;
  /**
   * Map contento as cartelas dos ususários
   */
  private users: Map<string, Cartela>;
  /**
   * Lista de números sortidos
   */
  private sorted: number[];

  constructor(premio = '') {
    this.premio = premio;
    this.users = new Map();
    this.sorted = [];
  }

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
  createTable(userId: string): Cartela {
    if (this.users.get(userId)) throw new UserAlreadyHasCartelaException();
    const cartela = new Cartela(userId);
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
  bingo(userId: string) {
    const cartela = this.users.get(userId);

    if (!cartela)
      throw new UserDoesNotHaveCartelaException();

    if (this.sorted.length < 24)
      throw new NotEnoughtSortedNumbersException();

    return this.removeAllNumbers(userId);
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
  removeNumber(userId: string, value: number): NumberPosition {
    if (!this.sorted.includes(value))
      throw new InvalidRemoveValuesException();

    const cartela = this.users.get(userId);

    if (!cartela)
      throw new UserDoesNotHaveCartelaException();

    return cartela.getPosition(value);
  }

  /**
   * Remove da cartela do usuário todos os números sorteados até o momento.
   * @param userId Id do usuário para remover os números
   * @returns As posições que deme ser removidas
   *
   * @throws {UserDoesNotHaveCartelaException} Usuário ainda não tem uma cartela
   * @throws {UserDoesNotHaveNumberException} Usuário não possui esse número na cartela
   */
  removeAllNumbers(userId: string): NumberPosition[] {
    const cartela = this.users.get(userId);

    if (!cartela)
      throw new UserDoesNotHaveCartelaException();

    return cartela.getAllPositions(this.sorted);
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
