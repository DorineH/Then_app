'use client'

import React from 'react';

interface EmojiSelectorProps {
  emojis: string[];
  selected: string[];
  onSelect: (index: number, emoji: string) => void;
  disabled?: boolean;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ emojis, selected, onSelect, disabled }) => {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex gap-4 justify-center mb-2">
        {selected.map((emoji, idx) => (
          <button
            key={idx}
            className={`text-4xl w-16 h-16 flex items-center justify-center rounded-lg border-2 border-gray-200 bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}
            disabled={disabled}
            onClick={() => !disabled && onSelect(idx, emoji)}
            type="button"
          >
            {emoji || <span className="text-gray-300">?</span>}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            className={`text-3xl w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
            disabled={disabled}
            onClick={() => {
              // Find first empty slot
              const emptyIdx = selected.findIndex((e) => !e);
              if (emptyIdx !== -1 && !disabled) {
                onSelect(emptyIdx, emoji);
              }
            }}
            type="button"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiSelector;
