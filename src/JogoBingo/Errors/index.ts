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
