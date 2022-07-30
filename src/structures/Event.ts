import { ClientEvents } from 'discord.js';

export class EventBase {
  event: keyof ClientEvents;

  run: (...args: any[]) => void;

  constructor(mEvent: keyof ClientEvents, mRun: (...args: any[]) => void) {
    this.event = mEvent;
    this.run = mRun;
  }
}
