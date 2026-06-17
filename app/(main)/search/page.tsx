import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-(--text-primary) tracking-tight mb-3">
          Explore
        </h1>
        <p className="text-(--text-secondary) font-mono text-sm tracking-wide">
          SEARCH ACROSS THE KNOWLEDGE GRAPH
        </p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-(--text-muted) group-focus-within:text-(--accent) transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 bg-[rgba(255,255,255,0.02)] border border-(--border) rounded-xl text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-1 focus:ring-(--accent) focus:border-(--accent) focus:bg-[rgba(255,255,255,0.04)] transition-all duration-300 backdrop-blur-md"
          placeholder="Search topics, articles, or concepts..."
        />
      </div>

      {/* Placeholder for trending or recommended topics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {['History', 'Science', 'Philosophy', 'Art', 'Technology', 'Mythology'].map((topic) => (
          <div key={topic} className="p-4 rounded-lg border border-(--border) bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.1)] transition-colors cursor-pointer text-center">
            <span className="font-sans text-sm text-(--text-secondary)">{topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
