import React from 'react';
import { useTextContrastAnalysis } from '../../hooks/useTextContrastAnalysis';

const TextContrastAnalysis = ({ extractedText, firstImage }) => {
  const { textAnalysis, isAnalyzing, overallRisk, analyzeTextContrast } = useTextContrastAnalysis(extractedText, firstImage);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'High': return 'text-green-400';
      case 'Moderate': return 'text-yellow-400';
      case 'Low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-2 shadow-xl">
      <div className="flex flex-col gap-2 justify-between mb-6">
        <h3 className="text-xl font-semibold text-zinc-100">
          📝 Context-Based Text Contrast Analysis
        </h3>
        <div className="flex text-sm items-center space-x-4">
          <span className="text-zinc-400">Overall Risk Level:</span>
          <span className={`font-bold ${getRiskColor(overallRisk)}`}>
            {overallRisk.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={analyzeTextContrast}
          disabled={!extractedText || !firstImage || isAnalyzing}
          className="px-6 py-3 bg-violet-600 text-zinc-100 rounded-lg hover:bg-violet-700 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-zinc-200"></div>
              <span>Analyzing Text Contrast...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Analyze Text Contrast</span>
            </>
          )}
        </button>
      </div>

      {textAnalysis.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Summary Stats */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-lg font-medium text-zinc-100 mb-3">Analysis Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Text Blocks Detected:</span>
                  <span className="text-zinc-200 font-medium">{textAnalysis.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Passed Tests:</span>
                  <span className="text-green-400 font-medium">
                    {textAnalysis.filter(result => result.status === 'Pass').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Failed Tests:</span>
                  <span className="text-red-400 font-medium">
                    {textAnalysis.filter(result => result.status === 'Fail').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Worst Contrast:</span>
                  <span className="text-zinc-200 font-medium">
                    {Math.min(...textAnalysis.map(r => r.contrastRatio)).toFixed(1)}:1
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-lg font-medium text-zinc-100 mb-3">Risk Distribution</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-400 rounded"></div>
                  <span className="text-zinc-400">High Risk:</span>
                  <span className="text-red-400 font-medium">
                    {textAnalysis.filter(r => r.riskLevel === 'High').length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-zinc-400">Medium Risk:</span>
                  <span className="text-yellow-400 font-medium">
                    {textAnalysis.filter(r => r.riskLevel === 'Medium').length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span className="text-zinc-400">Low Risk:</span>
                  <span className="text-green-400 font-medium">
                    {textAnalysis.filter(r => r.riskLevel === 'Low').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-zinc-900 rounded-lg p-4">
            <h4 className="text-lg font-medium text-zinc-100 mb-4">Detailed Text Analysis</h4>
            <div className="space-y-3">
              {textAnalysis.map((result) => (
                <div key={result.id} className="border border-zinc-700 rounded-lg p-4">
                  <div className="flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className="w-6 h-6 rounded border border-zinc-600"
                          style={{ backgroundColor: result.textColor }}
                        ></div>
                        <span className="text-zinc-300">vs</span>
                        <div
                          className="w-6 h-6 rounded border border-zinc-600"
                          style={{ backgroundColor: result.backgroundColor }}
                        ></div>
                        <div className="text-zinc-300">
                          <div className="font-mono text-sm">{result.textColor}</div>
                          <div className="font-mono text-sm">{result.backgroundColor}</div>
                        </div>
                      </div>
                      <div className="text-zinc-200 bg-zinc-700 p-4 rounded-lg text-sm">
                        "{result.text}"
                      </div>
                    </div>
                    <div className="p-2">
                      <div className={`text-lg font-bold ${getRiskColor(result.riskLevel)}`}>
                        {result.contrastRatio.toFixed(1)}:1
                      </div>
                      <div className={`text-sm ${getConfidenceColor(result.confidence)}`}>
                        {result.status}
                        {result.riskLevel !== 'Low' && (
                          <span className="ml-2">({result.riskLevel} Risk)</span>
                        )}
                      </div>
                      <div className="text-zinc-400 text-xs mt-1">
                        Threshold: {result.threshold}:1 ({result.isLargeText ? 'Large Text' : 'Normal Text'})
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextContrastAnalysis;
