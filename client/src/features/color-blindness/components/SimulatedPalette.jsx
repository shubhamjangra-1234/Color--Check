import React from 'react';
import { simulateColorBlindness } from '../utils/simulate';

const SimulatedPalette = ({
  colors,
  mode,
  showOriginal = false
}) => {
  if (!colors || colors.length === 0) {
    return (
      <div className="text-zinc-500 text-center py-8">
        No colors to display
      </div>
    );
  }

  // Simulate colors based on mode
  const displayColors = colors.map(color => {
    const simulatedColor = simulateColorBlindness(color, mode);
    return {
      original: color,
      simulated: simulatedColor
    };
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">
          Color Palette {mode !== 'normal' && `(${mode})`}
        </h3>
        {mode !== 'normal' && (
          <span className="text-xs capitalize text-amber-400 bg-amber-900/30 px-2 py-1 rounded">
            {mode} Mode
          </span>
        )}
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayColors.map((colorData, index) => (
          <div key={index} className="space-y-2">
            {/* Color Display */}
            <div className="relative group">
              {showOriginal && mode !== 'normal' ? (
                <div className="flex">
                  <div 
                    className="w-1/2 h-16 rounded-l-lg border-2 border-zinc-700 shadow-md"
                    style={{ backgroundColor: colorData.original }}
                    title="Original"
                  />
                  <div 
                    className="w-1/2 h-16 rounded-r-lg border-2 border-zinc-700 shadow-md"
                    style={{ backgroundColor: colorData.simulated }}
                    title="Simulated"
                  />
                </div>
              ) : (
                <div 
                  className="w-full h-16 rounded-lg border-2 border-zinc-700 shadow-md"
                  style={{ backgroundColor: colorData.simulated }}
                  title={mode !== 'normal' ? `Simulated (${mode})` : 'Original'}
                />
              )}
            </div>

            {/* Color Information */}
            <div className="text-xs space-y-1">
              <div className="font-mono text-zinc-300">
                {colorData.original}
              </div>
              {mode !== 'normal' && colorData.simulated !== colorData.original && (
                <div className="font-mono text-zinc-500 text-xs">
                  → {colorData.simulated}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulatedPalette;
