/**
 * Parses Wikipedia HTML content to strip unnecessary elements and prepare it for rendering.
 */
export function parseWikipediaContent(html: string): string {
  if (!html) return '';
  
  // Basic stripping for now (can be expanded based on specific formatting needs)
  let cleanHtml = html;
  
  // Remove reference links [1], [2], etc.
  cleanHtml = cleanHtml.replace(/<sup[^>]*class="reference"[^>]*>.*?<\/sup>/g, '');
  
  // Remove edit section links
  cleanHtml = cleanHtml.replace(/<span class="mw-editsection">.*?<\/span>/g, '');
  
  // Remove empty paragraphs
  cleanHtml = cleanHtml.replace(/<p><\/p>/g, '');
  
  // Ensure links open in new tabs if needed
  cleanHtml = cleanHtml.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" class="text-(--accent) hover:text-(--accent-hover) underline underline-offset-4" ');

  // Make infoboxes look decent
  cleanHtml = cleanHtml.replace(/<table[^>]*class="[^"]*infobox[^"]*"[^>]*>/g, '<table class="w-full max-w-md float-right ml-6 mb-6 p-4 bg-(--bg-card) border border-(--border) rounded-xl text-sm">');
  
  // Basic image styling
  cleanHtml = cleanHtml.replace(/<img /g, '<img class="rounded-xl my-4 object-cover max-w-full h-auto" ');

  return cleanHtml;
}
