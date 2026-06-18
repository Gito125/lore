'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, Save, RotateCcw } from 'lucide-react';
import { updateUserInterests } from '@/app/(main)/settings/interests/actions';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

const ALL_CATEGORIES = [
  'Technology', 'History', 'Mythology', 'Science', 'Art', 'Space Exploration',
  'Philosophy', 'Literature', 'Geography', 'Mathematics', 'Biology', 'Physics',
  'Ancient Civilizations', 'Psychology', 'Economics', 'Architecture', 'Music',
  'Film', 'Photography', 'Programming', 'Astronomy', 'Politics', 'Sociology'
];

export function InterestsClient({ initialInterests }: { initialInterests: string[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialInterests));
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();

  const displayedCategories = useMemo(() => {
    let filtered = ALL_CATEGORIES;
    if (search.trim()) {
      filtered = ALL_CATEGORIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));
      // Allow them to add a custom category if it doesn't match perfectly
      const hasExactMatch = filtered.some(c => c.toLowerCase() === search.toLowerCase());
      if (!hasExactMatch) {
        filtered = [search, ...filtered];
      }
    }
    // ensure selected items always show if search is empty
    if (!search.trim()) {
      const selectedArray = Array.from(selected);
      const others = filtered.filter(c => !selected.has(c));
      return [...selectedArray, ...others];
    }
    return filtered;
  }, [search, selected]);

  const toggleCategory = (category: string) => {
    const next = new Set(selected);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setSelected(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateUserInterests(Array.from(selected));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelected(new Set(['Science', 'History', 'Technology']));
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 z-20 bg-(--bg-primary) py-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="relative w-full sm:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-(--text-muted) group-focus-within:text-(--accent) transition-colors" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-[rgba(255,255,255,0.02)] border border-(--border) rounded-xl text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-1 focus:ring-(--accent) focus:border-(--accent) transition-all duration-300"
            placeholder="Search or add custom topic..."
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-(--border) text-(--text-secondary) hover:text-(--text-primary) hover:bg-[rgba(255,255,255,0.04)] transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-(--accent) hover:bg-(--accent-hover) text-white transition-colors text-sm font-medium shadow-[0_0_20px_rgba(108,99,255,0.2)] disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {displayedCategories.map((category) => {
            const isSelected = selected.has(category);
            return (
              <motion.div
                layout
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => toggleCategory(category)}
                className={clsx(
                  'cursor-pointer relative overflow-hidden rounded-2xl border p-6 flex flex-col gap-2 transition-all duration-300',
                  isSelected 
                    ? 'border-(--accent) bg-[rgba(108,99,255,0.1)] shadow-[0_0_20px_rgba(108,99,255,0.05)]' 
                    : 'border-(--border) bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.04)]'
                )}
              >
                <div className="flex justify-between items-start">
                  <span className={clsx(
                    "font-medium text-lg transition-colors",
                    isSelected ? "text-(--text-primary)" : "text-(--text-secondary)"
                  )}>
                    {category}
                  </span>
                  <div className={clsx(
                    "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300",
                    isSelected ? "bg-(--accent) border-(--accent)" : "border-(--border) bg-transparent"
                  )}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-10 -right-10 w-24 h-24 bg-(--accent) opacity-20 blur-2xl rounded-full"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
