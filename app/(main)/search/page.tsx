import { SearchClient } from '@/components/search/SearchClient';

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

      <SearchClient />
    </div>
  );
}
