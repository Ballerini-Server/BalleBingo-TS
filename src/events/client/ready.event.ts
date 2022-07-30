import { BalleBingo } from '../../structures/Client';
import { EventBase } from '../../structures/Event';

export default new EventBase('ready', async () => {
  const ballebingo = BalleBingo.getInstance();

  console.log(`Iniciado com o bot: ${ballebingo.user.username}`);
});
