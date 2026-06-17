'use client';

import { useState, useRef, useEffect } from 'react';
import { saveOnboardingTopics } from './actions';
import gsap from 'gsap';

const CURATED_TOPICS = [
  'History', 'Science', 'Technology', 'Art', 'Philosophy', 
  'Literature', 'Geography', 'Mathematics', 'Biology', 'Physics',
  'Space Exploration', 'Ancient Civilizations', 'Psychology', 'Economics'
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.reveal-text', 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", stagger: 0.2 }
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
      <div className="max-w-2xl w-full text-center">
        <h1 className="reveal-text text-4xl md:text-5xl font-serif text-(--text-primary) mb-4">What interests you?</h1>
        <p className="reveal-text text-(--text-secondary) font-mono text-sm tracking-widest uppercase mb-12">
          Select at least 3 topics to personalize your reading experience
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CURATED_TOPICS.map((topic) => {
            const isSelected = selected.has(topic);
            return (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`
                  reveal-topic px-6 py-3 rounded-full border text-sm md:text-base transition-colors duration-200
                  ${isSelected 
                    ? 'bg-(--text-primary) text-(--bg-primary) border-(--text-primary)' 
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
            reveal-button px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300
            ${selected.size >= 3 
              ? 'bg-(--accent) text-white hover:bg-(--accent-hover) shadow-[0_8px_32px_rgba(108,99,255,0.4)]' 
              : 'bg-[rgba(255,255,255,0.02)] text-(--text-muted) border border-(--border) cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? 'Saving...' : 'Start Reading'}
        </button>
      </div>
    </div>
  );
}
