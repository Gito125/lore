'use client';

import { useState } from 'react';
import { saveOnboardingTopics } from './actions';
import { motion } from 'framer-motion';
import { durations } from '@/lib/motion/springs';
import { easings } from '@/lib/motion/easings';

const CURATED_TOPICS = [
  'History', 'Science', 'Technology', 'Art', 'Philosophy', 
  'Literature', 'Geography', 'Mathematics', 'Biology', 'Physics',
  'Space Exploration', 'Ancient Civilizations', 'Psychology', 'Economics'
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.normal, ease: easings.standard }}
        className="max-w-2xl w-full text-center"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-4">What interests you?</h1>
        <p className="text-text-secondary text-lg mb-12">
          Select at least 3 topics to personalize your reading experience.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CURATED_TOPICS.map((topic) => {
            const isSelected = selected.has(topic);
            return (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`
                  px-6 py-3 rounded-full border text-sm md:text-base transition-colors duration-200
                  ${isSelected 
                    ? 'bg-text-primary text-bg-primary border-text-primary' 
                    : 'bg-transparent text-text-secondary border-[var(--border)] hover:border-text-secondary'
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
            px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200
            ${selected.size >= 3 
              ? 'bg-accent text-white hover:bg-accent-hover shadow-[0_8px_32px_rgba(108,99,255,0.4)]' 
              : 'bg-bg-secondary text-text-muted cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? 'Saving...' : 'Start Reading'}
        </button>
      </motion.div>
    </div>
  );
}
