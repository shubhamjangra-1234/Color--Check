import React from 'react';

const ReportSummary = ({ report }) => {
  const getScoreIcon = (score) => {
    if (score >= 80) return '✅';
    if (score >= 60) return '⚠️';
    return '❌';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const summaryItems = [
    {
      label: 'WCAG Score',
      value: `${report.wcagResults.overallScore}%`,
      icon: getScoreIcon(report.wcagResults.overallScore),
      color: getScoreColor(report.wcagResults.overallScore),
    },
    {
      label: 'Total Colors',
      value: report.extractedPalette.length.toString(),
      icon: '🎨',
      color: 'text-zinc-300',
    },
    {
      label: 'Contrast Issues',
      value: report.wcagResults.failures.length.toString(),
      icon: report.wcagResults.failures.length > 0 ? '⚠️' : '✅',
      color: report.wcagResults.failures.length > 0 ? 'text-yellow-400' : 'text-green-400',
    },
    {
      label: 'Text Detected',
      value: report.textAnalysis.hasText ? 'Yes' : 'No',
      icon: report.textAnalysis.hasText ? '📝' : '📄',
      color: report.textAnalysis.hasText ? 'text-zinc-300' : 'text-zinc-500',
    },
    {
      label: 'Suggestions',
      value: report.colorSuggestions.length.toString(),
      icon: report.colorSuggestions.length > 0 ? '💡' : '✅',
      color: report.colorSuggestions.length > 0 ? 'text-violet-400' : 'text-green-400',
    },
  ];

  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">Report Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`text-2xl mb-2 ${item.color}`}>{item.icon}</div>
            <div className={`text-lg font-semibold ${item.color}`}>{item.value}</div>
            <div className="text-zinc-400 text-sm mt-1">{item.label}</div>
          </div>
        ))}
      </div>
      
      {/* Quick Status */}
      <div className="mt-6 pt-4 border-t border-zinc-700">
        <div className="flex items-center justify-between">
          <div className="text-zinc-400 text-sm">
            Overall Status:
          </div>
          <div className={`font-medium ${getScoreColor(report.wcagResults.overallScore)}`}>
            {report.wcagResults.overallScore >= 80 ? 'Excellent Accessibility' :
             report.wcagResults.overallScore >= 60 ? 'Good Accessibility' :
             report.wcagResults.overallScore >= 40 ? 'Needs Improvement' : 'Poor Accessibility'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary;
