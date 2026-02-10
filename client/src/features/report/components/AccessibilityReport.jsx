import React from 'react';
import { ReportExportService } from '../services/pdf.export';
import ReportSummary from './ReportSummary';

const AccessibilityReport = ({ report, onClose }) => {
  if (!report) return null;

  const handleExportJSON = () => {
    try {
      ReportExportService.exportAsJSON(report, report.imageName);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export JSON report. Please try again.');
    }
  };

  const handleExportPDF = () => {
    try {
      ReportExportService.exportAsPDF(report, report.imageName);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF report. Please try again.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-800 border-b border-zinc-700 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                Accessibility Report
              </h2>
              <p className="text-zinc-400 text-sm">
                Image: {report.imageName} • Generated: {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Section */}
          <ReportSummary report={report} />

          {/* WCAG Score */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Overall WCAG Score</h3>
            <div className="flex items-center space-x-4">
              <div className={`text-4xl font-bold ${getScoreColor(report.wcagResults.overallScore)}`}>
                {report.wcagResults.overallScore}%
              </div>
              <div>
                <div className={`text-lg font-medium ${getScoreColor(report.wcagResults.overallScore)}`}>
                  {getScoreLabel(report.wcagResults.overallScore)}
                </div>
                <div className="text-zinc-400 text-sm">
                  {report.wcagResults.passedTests} of {report.wcagResults.totalTests} tests passed
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Extracted Color Palette</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {report.extractedPalette.map((color, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg border border-zinc-700 mb-2"
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-xs text-zinc-400 font-mono">{color}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contrast Failures */}
          {report.wcagResults.failures.length > 0 && (
            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">
                Contrast Issues ({report.wcagResults.failures.length})
              </h3>
              <div className="space-y-3">
                {report.wcagResults.failures.map((failure, index) => (
                  <div key={index} className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded border border-zinc-600"
                        style={{ backgroundColor: failure.color1 }}
                      />
                      <span className="text-zinc-400">vs</span>
                      <div
                        className="w-8 h-8 rounded border border-zinc-600"
                        style={{ backgroundColor: failure.color2 }}
                      />
                      <div className="text-zinc-300">
                        <span className="font-mono">{failure.color1}</span>
                        <span className="mx-2">/</span>
                        <span className="font-mono">{failure.color2}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-medium">{failure.contrast}:1</div>
                      <div className="text-zinc-400 text-sm">{failure.issue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Text Analysis */}
          <div className="bg-zinc-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Text Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-400">Text Detected:</span>
                <span className={report.textAnalysis.hasText ? 'text-green-400' : 'text-zinc-500'}>
                  {report.textAnalysis.hasText ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Character Count:</span>
                <span className="text-zinc-300">{report.textAnalysis.textLength}</span>
              </div>
              {report.textAnalysis.extractedText && (
                <div className="mt-4">
                  <div className="text-zinc-400 text-sm mb-2">Extracted Text:</div>
                  <div className="bg-zinc-800 rounded-lg p-3 text-zinc-300 text-sm max-h-32 overflow-y-auto">
                    {report.textAnalysis.extractedText}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Color Suggestions */}
          {report.colorSuggestions.length > 0 && (
            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">
                Color Suggestions ({report.colorSuggestions.length})
              </h3>
              <div className="space-y-2">
                {report.colorSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded border border-zinc-600"
                        style={{ backgroundColor: suggestion.color }}
                      />
                      <span className="text-zinc-300 font-mono text-sm">{suggestion.color}</span>
                    </div>
                    <div className="text-zinc-400 text-sm">
                      {suggestion.suggestion !== 'Good contrast' ? (
                        <span>
                          Use <span className="text-green-400 font-medium">{suggestion.suggestion}</span> instead
                        </span>
                      ) : (
                        <span className="text-green-400">{suggestion.suggestion}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-zinc-800 border-t border-zinc-700 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Export Section */}
            <div className="flex flex-col space-y-2">
              <div className="text-zinc-400 text-sm font-medium mb-2">Export Options:</div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-zinc-100 rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-300 flex items-center space-x-2 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-zinc-100 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center space-x-2 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-zinc-700 text-zinc-100 rounded-lg hover:bg-zinc-600 transition-colors font-medium"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityReport;
