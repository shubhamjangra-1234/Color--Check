import React, { useState } from 'react';

const TextAnalysisTab = ({ report, getScoreColor, getRiskColor }) => {
  const [copied, setCopied] = useState(false);
  
  // Calculate text metrics
  const textAnalysis = report.textAnalysis || {};
  const extractedText = textAnalysis.extractedText || '';
  const hasText = textAnalysis.hasText || false;
  const textLength = textAnalysis.textLength || 0;
  const wordCount = extractedText ? extractedText.split(/\s+/).filter(word => word.length > 0).length : 0;
  const lineCount = extractedText ? extractedText.split('\n').filter(line => line.trim().length > 0).length : 0;
  const avgLineLength = lineCount > 0 ? Math.round(textLength / lineCount) : 0;
  const textQuality = textLength > 100 ? 'Good' : textLength > 10 ? 'Fair' : 'Limited';
  const readability = wordCount > 10 ? 'Readable' : 'Minimal';

  const copyTextToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Text Status Summary */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h4 className="text-lg font-medium text-zinc-100 mb-4 flex items-center gap-2">
          📝 Extracted Text Analysis
        </h4>
        
        {/* Status Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
            <div className="text-sm text-zinc-400 mb-1">Text Status</div>
            <div className={`text-lg font-bold ${hasText ? 'text-green-400' : 'text-zinc-400'}`}>
              {hasText ? 'Detected' : 'None'}
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
            <div className="text-sm text-zinc-400 mb-1">Characters</div>
            <div className="text-lg font-bold text-zinc-100">{textLength}</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
            <div className="text-sm text-zinc-400 mb-1">Words</div>
            <div className="text-lg font-bold text-zinc-100">{wordCount}</div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
          <h5 className="text-sm font-medium text-zinc-300 mb-3">Text Analysis Summary</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Lines:</span>
              <span className="font-mono text-zinc-100">{lineCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Avg Line Length:</span>
              <span className="font-mono text-zinc-100">{avgLineLength} chars</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Text Quality:</span>
              <span className={`font-medium ${
                textQuality === 'Good' ? 'text-green-400' : 
                textQuality === 'Fair' ? 'text-yellow-400' : 'text-zinc-400'
              }`}>{textQuality}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Readability:</span>
              <span className={`font-medium ${
                readability === 'Readable' ? 'text-green-400' : 'text-zinc-400'
              }`}>{readability}</span>
            </div>
          </div>
        </div>

        {/* Extracted Text Content */}
        {hasText && extractedText && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h5 className="text-sm font-medium text-zinc-300">Extracted Text Content</h5>
              <button
                onClick={() => copyTextToClipboard(extractedText)}
                className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors duration-200 flex-shrink-0"
                title={copied ? "Copied!" : "Copy text"}
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Text Display Area */}
            <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {extractedText.split('\n').map((line, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <span className="text-zinc-500 font-mono text-xs w-8 flex-shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-zinc-200 flex-1">
                      {line.trim() || <span className="text-zinc-500 italic">[empty line]</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quality Indicators */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-xs">
                ~{wordCount} words
              </span>
              <span className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-xs">
                {lineCount} lines
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${
                textQuality === 'Good' ? 'bg-green-900 text-green-300' : 
                textQuality === 'Fair' ? 'bg-yellow-900 text-yellow-300' : 'bg-zinc-700 text-zinc-300'
              }`}>
                Quality: {textQuality}
              </span>
            </div>
          </div>
        )}
        
        {!hasText && (
          <div className="mt-4 text-center py-8">
            <div className="text-zinc-400 text-sm">No text detected in uploaded image</div>
          </div>
        )}
      </div>

      {/* Text Contrast Results */}
      {report.textAnalysis?.contrastResults && report.textAnalysis.contrastResults.length > 0 && (
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
          <h4 className="text-lg font-medium text-zinc-100 mb-4 flex items-center gap-2">
            🎨 Text Contrast Results
          </h4>
          <div className="space-y-3">
            {report.textAnalysis.contrastResults.map((result, index) => (
              <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-8 h-8 rounded border-2 border-zinc-600"
                        style={{ backgroundColor: result.backgroundColor }}
                      ></div>
                      <div className="flex-1">
                        <div className="font-mono text-sm text-zinc-300">{result.backgroundColor}</div>
                        <div className="text-xs text-zinc-500">Background</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded border-2 border-zinc-600"
                        style={{ backgroundColor: result.textColor }}
                      ></div>
                      <div className="flex-1">
                        <div className="font-mono text-sm text-zinc-300">{result.textColor}</div>
                        <div className="text-xs text-zinc-500">Text</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg md:text-xl font-bold ${getScoreColor(result.contrastRatio * 100)}`}>
                      {result.contrastRatio.toFixed(1)}:1
                    </div>
                    <div className={`text-xs font-medium ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel} Risk
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-zinc-700 rounded text-sm text-zinc-300">
                  "{result.text}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalysisTab;
