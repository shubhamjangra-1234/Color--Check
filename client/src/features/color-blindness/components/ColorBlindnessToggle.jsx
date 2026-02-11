import React from 'react';
import { getColorBlindnessModes } from '../utils/simulate';

const ColorBlindnessToggle = ({
  currentMode,
  onModeChange,
  disabled = false
}) => {
  const modes = getColorBlindnessModes();

  return (
    <div className="bg-zinc-800 rounded-lg p-2 shadow-lg">
      <div className="flex flex-col md:flex-row gap-2 justify-between mb-3">
        <h3 className="text-lg font-semibold text-nowrap text-zinc-100">Color Vision</h3>
        {currentMode !== 'normal' && (
          <span className="text-xs text-amber-400 bg-amber-900/30 px-2 py-1 rounded">
            Simulation – visual approximation
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {modes.map((mode) => (
          <button
            key={mode.type}
            onClick={() => onModeChange(mode.type)}
            disabled={disabled}
            className={`
              px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${currentMode === mode.type
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={mode.description}
          >
            <div className="text-left">
              <div className="font-medium">{mode.label}</div>
              <div className="text-xs opacity-75 mt-0.5">{mode.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorBlindnessToggle;
