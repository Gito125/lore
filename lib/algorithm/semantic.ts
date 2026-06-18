import natural from 'natural';

export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

function tokenize(text: string): string[] {
  if (!text) return [];
  const words = text.toLowerCase().replace(/[^\w\s]|_/g, '').split(/\s+/);
  return words
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    .map(w => natural.PorterStemmer.stem(w));
}

function getTokens(text: string): { unigrams: string[], bigrams: string[] } {
  const unigrams = tokenize(text);
  const bigrams: string[] = [];
  for (let i = 0; i < unigrams.length - 1; i++) {
    bigrams.push(`${unigrams[i]}_${unigrams[i+1]}`);
  }
  return { unigrams, bigrams };
}

function getTermFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  const total = tokens.length || 1;
  for (const [key, count] of tf.entries()) {
    tf.set(key, count / total);
  }
  return tf;
}

/**
 * Calculates a hybrid similarity score combining TF similarity and keyword overlap.
 * Uses stemming and bigrams for better semantic matching.
 */
export function calculateSemanticSimilarity(text1: string, text2: string): number {
  const t1 = getTokens(text1);
  const t2 = getTokens(text2);

  const allTokens1 = [...t1.unigrams, ...t1.bigrams];
  const allTokens2 = [...t2.unigrams, ...t2.bigrams];

  if (allTokens1.length === 0 || allTokens2.length === 0) return 0.0;

  const tf1 = getTermFrequencies(allTokens1);
  const tf2 = getTermFrequencies(allTokens2);

  const allWords = new Set([...tf1.keys(), ...tf2.keys()]);

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  let overlapCount = 0;

  for (const word of allWords) {
    const val1 = tf1.get(word) || 0;
    const val2 = tf2.get(word) || 0;
    
    if (val1 > 0 && val2 > 0) overlapCount++;

    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  }

  const tfSimilarity = (magnitude1 === 0 || magnitude2 === 0) 
    ? 0.0 
    : dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));

  const maxUniqueTokens = Math.min(tf1.size, tf2.size);
  const keywordOverlap = maxUniqueTokens === 0 ? 0.0 : overlapCount / maxUniqueTokens;

  // Hybrid score
  return (0.7 * tfSimilarity) + (0.3 * keywordOverlap);
}

/**
 * Compare a candidate article against a user's recent reading history summaries.
 */
export function getHistorySimilarityScore(candidateSummary: string, recentSummaries: string[]): number {
  if (recentSummaries.length === 0) return 0.0;

  let totalScore = 0;
  for (const recent of recentSummaries) {
    totalScore += calculateSemanticSimilarity(candidateSummary, recent);
  }
  
  return totalScore / recentSummaries.length;
}
