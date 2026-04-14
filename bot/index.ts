// bot/index.ts
import 'dotenv/config';
import { Bot, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import type { Context, SessionFlavor } from 'grammy';
import type { ConversationFlavor } from '@grammyjs/conversations';
import { tipWizard } from './wizard';

type MyContext = Context & SessionFlavor<Record<string, never>> & ConversationFlavor;

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN missing. Copy .env.example to .env and set your token.');
  process.exit(1);
}

const bot = new Bot<MyContext>(token);

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
bot.use(createConversation(tipWizard, 'tipWizard'));

bot.command('start', (ctx) =>
  ctx.reply('Hi! Send /tip to calculate a bill, or /help for usage.')
);

bot.command('help', (ctx) =>
  ctx.reply(
    [
      'Commands:',
      '/tip — start a tip calculation',
      '/cancel — abort the current calculation',
      '/help — show this message',
    ].join('\n')
  )
);

bot.command('tip', async (ctx) => {
  await ctx.conversation.enter('tipWizard');
});

bot.command('cancel', async (ctx) => {
  await ctx.conversation.exit('tipWizard');
  await ctx.reply('Cancelled.');
});

bot.catch((err) => {
  console.error('Bot error:', err);
});

bot.start({
  onStart: (info) => console.log(`Bot @${info.username} started (polling).`),
});
