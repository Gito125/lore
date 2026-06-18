'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { saveOnboardingTopics } from './actions';
import gsap from 'gsap';
import { Search } from 'lucide-react';

const CURATED_TOPICS = [
  'Technology', 'History', 'Mythology', 'Science', 'Art', 'Space Exploration',
  'Philosophy', 'Literature', 'Geography', 'Mathematics', 'Biology', 'Physics',
  'Ancient Civilizations', 'Psychology', 'Economics', 'Architecture', 'Music',
  'Film', 'Photography', 'Programming', 'Astronomy', 'Politics', 'Sociology'
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayedTopics = useMemo(() => {
    let filtered = CURATED_TOPICS;
    if (search.trim()) {
      filtered = CURATED_TOPICS.filter(c => c.toLowerCase().includes(search.toLowerCase()));
      const hasExactMatch = filtered.some(c => c.toLowerCase() === search.toLowerCase());
      if (!hasExactMatch) {
        filtered = [search, ...filtered];
      }
    }
    if (!search.trim()) {
      const selectedArray = Array.from(selected);
      const others = filtered.filter(c => !selected.has(c));
      return [...selectedArray, ...others];
    }
    return filtered;
  }, [search, selected]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.reveal-text', 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.2 }
      )
      .fromTo('.reveal-search',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo('.reveal-topic',
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "back.out(1.7)" },
        "-=0.8"
      )
      .fromTo('.reveal-button',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const toggleTopic = (topic: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(topic)) {
      newSelected.delete(topic);
    } else {
      newSelected.add(topic);
    }
    setSelected(newSelected);
  };

  const handleSubmit = async () => {
    if (selected.size < 3) return;
    setIsSubmitting(true);
    try {
      await saveOnboardingTopics(Array.from(selected));
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) flex flex-col items-center justify-center p-6" ref={containerRef}>
      <div className="max-w-3xl w-full text-center">
        <h1 className="reveal-text text-4xl md:text-5xl font-serif text-(--text-primary) mb-4">What interests you?</h1>
        <p className="reveal-text text-(--text-secondary) font-mono text-sm tracking-widest uppercase mb-8">
          Select at least 3 topics to personalize your reading experience
        </p>

        <div className="reveal-search relative max-w-md mx-auto mb-10 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-(--text-muted) group-focus-within:text-(--accent) transition-colors" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-2xl text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-1 focus:ring-(--accent) focus:border-(--accent) focus:bg-[rgba(255,255,255,0.04)] transition-all duration-300"
            placeholder="Search or add custom topics..."
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {displayedTopics.map((topic) => {
            const isSelected = selected.has(topic);
            return (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`
                  reveal-topic px-6 py-3 rounded-full border text-sm md:text-base transition-all duration-300
                  ${isSelected 
                    ? 'bg-(--text-primary) text-(--bg-primary) border-(--text-primary) scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                    : 'bg-transparent text-(--text-secondary) border-(--border) hover:border-(--text-secondary)'
                  }
                `}
              >
                {topic}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={selected.size < 3 || isSubmitting}
          className={`
            reveal-button px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300
            ${selected.size >= 3 
              ? 'bg-(--accent) text-white hover:bg-(--accent-hover) shadow-[0_8px_32px_rgba(108,99,255,0.4)]' 
              : 'bg-[rgba(255,255,255,0.02)] text-(--text-muted) border border-(--border) cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? 'Saving...' : `Start Reading (${selected.size}/3)`}
        </button>
      </div>
    </div>
  );
}
