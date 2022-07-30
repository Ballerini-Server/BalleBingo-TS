import { Message } from 'discord.js';
import { CommandBase } from '../../structures/CommandBase';

export default {
  name: 'initGame',

  description: '',

  permission: 'admins',

  aliases: ['init'],

  run: async (message: Message) => {
    message.channel.send('boom');
  },
} as CommandBase;
