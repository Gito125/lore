/**
 * Parses Wikipedia HTML content to strip unnecessary elements and prepare it for rendering.
 */
export function parseWikipediaContent(html: string): string {
  if (!html) return '';
  
  // Basic stripping for now (can be expanded based on specific formatting needs)
  let cleanHtml = html;
  
  // Remove reference links [1], [2], etc.
  cleanHtml = cleanHtml.replace(/<sup[^>]*class="reference"[^>]*>.*?<\/sup>/g, '');
  
  // Remove empty paragraphs
  cleanHtml = cleanHtml.replace(/<p><\/p>/g, '');
  
  // Ensure links open in new tabs if needed
  cleanHtml = cleanHtml.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  
  return cleanHtml;
}
