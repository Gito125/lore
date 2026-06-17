export function generateTwitterIntent(title: string, summary: string, url: string): string {
  // Simple "thread" style summary by splitting sentences (just a mock of AI generator for now)
  const sentences = summary.split(/(?<=\.)\s+/);
  
  let text = `Reading about: ${title}\n\n`;
  if (sentences.length > 0) {
    text += `${sentences[0]}\n\n`;
  }
  text += `Read more on Lore.`;

  const intentUrl = new URL('https://twitter.com/intent/tweet');
  intentUrl.searchParams.set('text', text);
  intentUrl.searchParams.set('url', url);

  return intentUrl.toString();
}
