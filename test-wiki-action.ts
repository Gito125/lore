import { getRelatedArticles } from './lib/wikipedia/api';

async function main() {
  const articles = await getRelatedArticles('Science');
  console.log('Related articles for Science:', articles.length);
  if (articles.length > 0) {
    console.log(articles[0].title);
    console.log(articles[0].categories);
    console.log(articles[0].extract?.substring(0, 50));
  }
}
main();
