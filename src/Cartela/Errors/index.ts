export class UserDoesNotHaveNumberException extends Error {
  number: number;
  constructor(number: number) {
    super(`Usuário não possui o número ${number} na cartela`);
    this.number = number;
  }
}

export class UserDoesNotCompleteException extends Error {
  constructor() {
    super(`Usuário ainda não concluiu sua cartela`);
  }
}
