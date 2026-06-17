import { getWikipediaArticleSummary } from './lib/wikipedia/api';

async function test() {
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/mobile-sections/Earth`, {
    headers: { 'Api-User-Agent': 'LoreApp/1.0 (Contact: admin@example.com)' }
  });
  const data = await res.json();
  console.log('Lead keys:', Object.keys(data.lead));
  console.log('Remaining keys:', Object.keys(data.remaining));
  console.log('Lead sections:', data.lead.sections.length);
  if (data.lead.image) {
    console.log('Has image');
  }
}
test();
