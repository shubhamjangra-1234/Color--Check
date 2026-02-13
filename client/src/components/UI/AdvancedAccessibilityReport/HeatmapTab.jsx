import React from 'react';

const HeatmapTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h4 className="text-lg font-medium text-zinc-100 mb-4 flex items-center gap-2">
          🌡️ Contrast Heatmap Analysis
        </h4>
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
          <div className="text-sm text-zinc-300 mb-4">
            Visual representation of contrast quality across the entire image
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-zinc-400">Green = Good contrast (≥4.5:1)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-zinc-400">Yellow = Medium contrast (3.0-4.5:1)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-zinc-400">Red = Poor contrast (&lt;3.0:1)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Statistics */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h4 className="text-lg font-medium text-zinc-100 mb-4">Heatmap Statistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600 text-center">
            <div className="text-2xl font-bold text-green-400">4.5+</div>
            <div className="text-sm text-zinc-400">Good Areas</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600 text-center">
            <div className="text-2xl font-bold text-yellow-400">3.0-4.5</div>
            <div className="text-sm text-zinc-400">Medium Areas</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600 text-center">
            <div className="text-2xl font-bold text-red-400">&lt;3.0</div>
            <div className="text-sm text-zinc-400">Poor Areas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapTab;
