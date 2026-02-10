import React from 'react';

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">
          Color Palette {mode !== 'normal' && `(${mode})`}
        </h3>
        {mode !== 'normal' && (
          <span className="text-xs text-amber-400 bg-amber-900/30 px-2 py-1 rounded">
            {mode} Mode
          </span>
        )}
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {colors.map((color, index) => (
          <div key={index} className="space-y-2">
            {/* Color Display */}
            <div className="relative group">
              <div 
                className="w-full h-16 rounded-lg border-2 border-zinc-700 shadow-md"
                style={{ backgroundColor: color }}
              />
            </div>

            {/* Color Information */}
            <div className="text-xs space-y-1">
              <div className="font-mono text-zinc-300">
                {color}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulatedPalette;
