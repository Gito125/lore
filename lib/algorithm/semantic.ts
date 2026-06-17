export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

function tokenize(text: string): string[] {
  if (!text) return [];
  // Lowercase, remove punctuation, split by whitespace
  const words = text.toLowerCase().replace(/[^\w\s]|_/g, '').split(/\s+/);
  return words.filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function getTermFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  // Normalize frequencies by total terms to get true TF
  const total = tokens.length;
  for (const [key, count] of tf.entries()) {
    tf.set(key, count / total);
  }
  return tf;
}

/**
 * Calculates cosine similarity between two texts based on Term Frequency.
 * Without a large corpus for exact IDF, this serves as an effective
 * proxy for text similarity for short summaries.
 */
export function calculateSemanticSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0.0;

  const tf1 = getTermFrequencies(tokens1);
  const tf2 = getTermFrequencies(tokens2);

  const allWords = new Set([...tf1.keys(), ...tf2.keys()]);

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const word of allWords) {
    const val1 = tf1.get(word) || 0;
    const val2 = tf2.get(word) || 0;
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  }

  if (magnitude1 === 0 || magnitude2 === 0) return 0.0;

  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

/**
 * Compare a candidate article against a user's recent reading history summaries.
 */
export function getHistorySimilarityScore(candidateSummary: string, recentSummaries: string[]): number {
  if (recentSummaries.length === 0) return 0.0;

  // Average the similarity score across the recent history
  let totalScore = 0;
  for (const recent of recentSummaries) {
    totalScore += calculateSemanticSimilarity(candidateSummary, recent);
  }
  
  return totalScore / recentSummaries.length;
}
