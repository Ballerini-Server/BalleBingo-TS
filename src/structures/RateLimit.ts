export class RateLimit {
  /**
   * Singleton pattern
   */
  static instance: RateLimit;

  public static getInstance(): RateLimit {
    if (!RateLimit.instance) {
      RateLimit.instance = new RateLimit();
    }
    return RateLimit.instance;
  }
  usersCard: UserLimit[] = [];
  userBingoFalse: UserLimit[] = [];

  secondsLimitGetCard = 5;
  secondsLimitGetBingo = 40;

  get getSecondsBingo() {
    return this.secondsLimitGetBingo;
  }
  get getSecondsCard() {
    return this.secondsLimitGetCard;
  }

  verifyUserGetCard(userId: string) {
    const user: UserLimit = this.usersCard.find(
      (user) => user.userId === userId
    );
    if (!user) {
      this.usersCard.push({ dateInteraction: new Date(), userId });
      return false;
    }
    const diffTime = Math.ceil(
      Math.abs(new Date().getTime() - user.dateInteraction.getTime()) / 1000
    );
    if (diffTime < this.secondsLimitGetCard) {
      this.usersCard.map((user) => {
        if (user.userId === userId) user.dateInteraction = new Date();
      });

      return true;
    }
    this.usersCard.map((user) => {
      if (user.userId === userId) user.dateInteraction = new Date();
    });
    return false;
  }

  verifyUserGetBingo(userId: string) {
    const user: UserLimit = this.userBingoFalse.find(
      (user) => user.userId === userId
    );
    if (!user) {
      this.userBingoFalse.push({ dateInteraction: new Date(), userId });
      return false;
    }
    const diffTime = Math.ceil(
      Math.abs(new Date().getTime() - user.dateInteraction.getTime()) / 1000
    );
    if (diffTime < this.secondsLimitGetBingo) {
      this.userBingoFalse.map((user) => {
        if (user.userId === userId) user.dateInteraction = new Date();
      });

      return true;
    }
    this.userBingoFalse.map((user) => {
      if (user.userId === userId) user.dateInteraction = new Date();
    });
    return false;
  }
}

type UserLimit = {
  userId: string;
  dateInteraction: Date;
};
