import React from 'react';

const TechnicalSpecsTab = ({ enhancedReport, report, getScoreColor }) => {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h4 className="text-lg font-medium text-zinc-100 mb-4 flex items-center gap-2">
          ⚙️ Technical Specifications
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex flex-row justify-between items-center">
              <div className="text-sm text-zinc-400 mb-1">WCAG Compliance</div>
              <div className="text-lg font-medium text-zinc-100">{enhancedReport.enhancedWCAG.accessibilityLevel}</div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="text-sm text-zinc-400 mb-1">Overall Score</div>
              <div className={`text-lg font-medium ${getScoreColor(enhancedReport.enhancedWCAG.overallScore)}`}>
                {enhancedReport.enhancedWCAG.overallScore}%
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="text-sm text-zinc-400 mb-1">Tests Performed</div>
              <div className="text-lg font-medium text-zinc-100">{enhancedReport.enhancedWCAG.totalTests}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-row justify-between items-center">
              <div className="text-sm text-zinc-400 mb-1">Success Rate</div>
              <div className="text-lg font-medium text-green-400">
                {Math.round((enhancedReport.enhancedWCAG.passedTests / enhancedReport.enhancedWCAG.totalTests) * 100)}%
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">

              <div className="text-sm text-zinc-400 mb-1">Generated</div>
              <div className="text-lg font-medium text-zinc-100">
                {new Date(report.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="text-sm text-zinc-400 mb-1">Report Version</div>
              <div className="text-lg font-medium text-zinc-100">v2.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Formats */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h4 className="text-lg font-medium text-zinc-100 mb-4">Available Export Formats</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">📄</div>
              <div>
                <div className="font-medium text-zinc-100">PDF Report</div>
                <div className="text-sm text-zinc-400">Professional formatted report</div>
              </div>
            </div>
            <div className="text-xs text-zinc-500">
              Includes all sections, charts, and recommendations
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-2xl">🔧</div>
              <div>
                <div className="font-medium text-zinc-100">JSON Data</div>
                <div className="text-sm text-zinc-400">Machine-readable format</div>
              </div>
            </div>
            <div className="text-xs text-zinc-500">
              Raw data for integration and analysis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSpecsTab;
