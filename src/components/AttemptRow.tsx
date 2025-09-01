'use client'

import React from 'react';

interface AttemptRowProps {
  attempt: string[]; // 3 emojis
  feedback: ('correct' | 'present' | 'absent')[]; // 3 feedbacks
  attemptNumber: number;
}

const feedbackIcons = {
  correct: '✅',
  present: '🔄',
  absent: '❌',
};

const AttemptRow: React.FC<AttemptRowProps> = ({ attempt, feedback, attemptNumber }) => {
  return (
    <div className="flex items-center justify-between w-full py-2 px-3 bg-white rounded-xl shadow mb-2">
      <div className="flex gap-2">
        {attempt.map((emoji, idx) => (
          <span key={idx} className="text-3xl w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
            {emoji || <span className="text-gray-300">?</span>}
          </span>
        ))}
      </div>
      <div className="flex gap-1 ml-4">
        {feedback.map((f, idx) => (
          <span key={idx} className="text-xl" title={f}>
            {feedbackIcons[f]}
          </span>
        ))}
      </div>
      <span className="text-xs text-gray-400 ml-2">#{attemptNumber + 1}</span>
    </div>
  );
};

export default AttemptRow;
