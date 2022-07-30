export class InvalidRemoveValuesException extends Error {
  constructor() {
    super('Valor enviado não está na lista de números sortidos');
  }
}

export class UserDoesNotHaveCartelaException extends Error {
  constructor() {
    super('Valor enviado não está na lista de números sortidos');
  }
}

export class UserAlreadyHasCartelaException extends Error {
  constructor() {
    super('Usuário já possui uma cartela');
  }
}

export class NotEnoughtSortedNumbersException extends Error {
  constructor() {
    super('Ainda não existem números suficiente para bingo');
  }
}
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
