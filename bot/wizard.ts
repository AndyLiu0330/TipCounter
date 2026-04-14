// bot/wizard.ts
import type { Conversation } from '@grammyjs/conversations';
import type { Context } from 'grammy';
import { calculateTip } from '../src/lib/calc';
import { formatResult } from './format';

type MyContext = Context;
type MyConversation = Conversation<MyContext>;

async function askNumber(
  conversation: MyConversation,
  ctx: MyContext,
  prompt: string,
  validate: (n: number) => boolean,
  retryMsg: string
): Promise<number | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    await ctx.reply(attempt === 0 ? prompt : `${retryMsg}\n${prompt}`);
    const { message } = await conversation.wait();
    const text = message?.text?.trim() ?? '';
    const n = Number(text);
    if (Number.isFinite(n) && validate(n)) return n;
  }
  await ctx.reply('Too many invalid inputs. Cancelling. Send /tip to try again.');
  return null;
}

export async function tipWizard(conversation: MyConversation, ctx: MyContext) {
  const subtotal = await askNumber(
    conversation, ctx,
    "What's the subtotal? (e.g. 45.20)",
    (n) => n > 0,
    'Please enter a positive number.'
  );
  if (subtotal === null) return;

  const tax = await askNumber(
    conversation, ctx,
    'Tax amount? (send 0 if none)',
    (n) => n >= 0,
    'Please enter 0 or a positive number.'
  );
  if (tax === null) return;

  const tipPercent = await askNumber(
    conversation, ctx,
    'Tip percentage? (e.g. 18)',
    (n) => n >= 0,
    'Please enter 0 or a positive number.'
  );
  if (tipPercent === null) return;

  const people = await askNumber(
    conversation, ctx,
    'How many people are splitting?',
    (n) => Number.isInteger(n) && n >= 1,
    'Please enter a whole number, 1 or more.'
  );
  if (people === null) return;

  const result = calculateTip({ subtotal, tax, tipPercent, people });
  await ctx.reply(formatResult(result, people));
}
