import React, { useState } from 'react';
import { useContrastHeatmap } from '../../hooks/useContrastHeatmap';

const ContrastHeatmap = ({ firstImage, contrastResults }) => {
  const { 
    showHeatmap, 
    setShowHeatmap, 
    isGenerating, 
    generateHeatmap, 
    heatmapStats 
  } = useContrastHeatmap(firstImage, contrastResults);

  const [heatmapData, setHeatmapData] = useState(null);

  const handleGenerateHeatmap = async () => {
    const result = await generateHeatmap();
    if (result) {
      setHeatmapData(result);
    }
  };

  const getContrastColor = (ratio) => {
    if (ratio >= 4.5) return 'text-green-400';
    if (ratio >= 3.0) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-2 shadow-xl">
      <div className="flex flex-col gap-2 justify-between mb-6">
        <h3 className="text-xl font-semibold text-zinc-100">
          🌡️ Visual Contrast Heatmap Overlay
        </h3>
        <div className="text-zinc-400 text-sm">
          Visualize contrast quality across the entire image
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6">
        <button
          onClick={handleGenerateHeatmap}
          disabled={!firstImage || !contrastResults.length || isGenerating}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-zinc-100 rounded-lg hover:from-green-700 hover:to-green-800 disabled:from-zinc-600 disabled:to-zinc-700 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-zinc-200"></div>
              <span>Generating Heatmap...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Generate Contrast Heatmap</span>
            </>
          )}
        </button>
      </div>

      {/* Statistics */}
      {heatmapStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-zinc-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-zinc-100">{heatmapStats.total}</div>
            <div className="text-sm text-zinc-400">Total Tests</div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold text-green-400`}>{heatmapStats.good}</div>
            <div className="text-sm text-zinc-400">Good (≥4.5:1)</div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold text-yellow-400`}>{heatmapStats.medium}</div>
            <div className="text-sm text-zinc-400">Medium (3.0-4.5:1)</div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold text-red-400`}>{heatmapStats.poor}</div>
            <div className="text-sm text-zinc-400">Poor (&lt;3.0:1)</div>
          </div>
        </div>
      )}

      {/* Heatmap Display */}
      {heatmapData && (
        <div className="space-y-4">
          <div className="bg-zinc-900 rounded-lg p-4">
            <h4 className="text-lg font-medium text-zinc-100 mb-4">Contrast Heatmap</h4>
            <div className="text-zinc-400 text-sm mb-4">
              <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span>
              Green = Good contrast (≥4.5:1)
              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mx-2 mr-2"></span>
              Yellow = Medium contrast (3.0-4.5:1)
              <span className="inline-block w-3 h-3 bg-red-400 rounded-full mx-2"></span>
              Red = Poor contrast (&lt;3.0:1)
            </div>
            
            {/* Heatmap Image */}
            <div className="relative max-w-md mx-auto">
              <img
                src={firstImage}
                alt="Original"
                className="w-full h-auto max-h-96 object-contain rounded-lg mb-4"
              />
              {heatmapData.heatmapUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={heatmapData.heatmapUrl}
                    alt="Contrast Heatmap"
                    className="w-full h-auto max-h-96 object-contain rounded-lg opacity-75"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-zinc-900 rounded-lg p-4">
            <h4 className="text-lg font-medium text-zinc-100 mb-4">Heatmap Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-400">Worst Contrast:</span>
                <span className={`font-bold ${getContrastColor(heatmapData.worstContrast)}`}>
                  {heatmapData.worstContrast.toFixed(1)}:1
                </span>
              </div>
              <div>
                <span className="text-zinc-400">Average Contrast:</span>
                <span className={`font-bold ${getContrastColor(heatmapData.averageContrast)}`}>
                  {heatmapData.averageContrast.toFixed(1)}:1
                </span>
              </div>
              <div>
                <span className="text-zinc-400">Best Contrast:</span>
                <span className="text-green-400 font-bold">
                  {heatmapData.bestContrast.toFixed(1)}:1
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Overlay
      {heatmapData && (
        <div className="mt-4">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="w-full px-4 py-2 bg-zinc-700 text-zinc-100 rounded-lg hover:bg-zinc-600 transition-colors"
          >
            {showHeatmap ? 'Hide Heatmap Overlay' : 'Show Heatmap Overlay'}
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ContrastHeatmap;
