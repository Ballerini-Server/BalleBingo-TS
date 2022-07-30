import { BalleBingo } from './structures/Client';

const balleBingo: BalleBingo = BalleBingo.getInstance();

async function helloBallebingo() {
  await balleBingo.loadEvents();
  await balleBingo.loadCommands();
  await balleBingo.init();
}

helloBallebingo();
