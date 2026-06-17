import { getRelatedArticles } from './lib/wikipedia/api';

async function main() {
  const articles = await getRelatedArticles('Science');
  console.log('Related articles for Science:', articles.length);
  
  const hArticles = await getRelatedArticles('History');
  console.log('Related articles for History:', hArticles.length);
}
main();
