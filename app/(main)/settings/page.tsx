export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-(--text-primary) tracking-tight mb-3">
          Settings
        </h1>
        <p className="text-(--text-secondary) font-mono text-sm tracking-wide">
          PREFERENCES & ACCOUNT
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-sm font-mono text-(--text-muted) uppercase tracking-widest border-b border-(--border) pb-2">Appearance</h2>
          <div className="p-4 rounded-xl border border-(--border) bg-[rgba(255,255,255,0.01)] flex items-center justify-between">
            <div>
              <p className="text-(--text-primary) font-medium">Theme</p>
              <p className="text-(--text-secondary) text-sm">Select your preferred visual style</p>
            </div>
            <select className="bg-[rgba(255,255,255,0.05)] border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--accent)">
              <option value="midnight">Midnight (Default)</option>
              <option value="obsidian">Obsidian</option>
              <option value="parchment">Parchment</option>
            </select>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono text-(--text-muted) uppercase tracking-widest border-b border-(--border) pb-2">Algorithm</h2>
          <div className="p-4 rounded-xl border border-(--border) bg-[rgba(255,255,255,0.01)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-(--text-primary) font-medium">Serendipity Level</p>
                <p className="text-(--text-secondary) text-sm">How often to show unexpected topics</p>
              </div>
              <input type="range" min="1" max="100" defaultValue="30" className="w-32 accent-(--accent)" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
