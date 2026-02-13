import React from 'react';

const OverviewTab = ({ enhancedReport, gradeInfo, getRiskColor, getScoreColor }) => {
  return (
    <div className="space-y-6">
      {/* Grade Display */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-6 md:p-8 text-center border border-zinc-700">
        <div className={`text-5xl md:text-7xl font-bold mb-3 ${gradeInfo.color}`}>
          {gradeInfo.grade}
        </div>
        <div className={`text-lg md:text-xl ${gradeInfo.color} mb-2`}>
          {gradeInfo.description}
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-zinc-400">
          <span>WCAG {enhancedReport.enhancedWCAG.accessibilityLevel} Compliant</span>
          <span>•</span>
          <span>{enhancedReport.enhancedWCAG.overallScore}% Overall Score</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-zinc-900 rounded-lg p-4 text-center border border-zinc-700">
          <div className="text-2xl md:text-3xl font-bold text-zinc-100">{enhancedReport.enhancedWCAG.totalTests}</div>
          <div className="text-xs md:text-sm text-zinc-400">Total Tests</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 text-center border border-zinc-700">
          <div className="text-2xl md:text-3xl font-bold text-green-400">{enhancedReport.enhancedWCAG.passedTests}</div>
          <div className="text-xs md:text-sm text-zinc-400">Passed</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 text-center border border-zinc-700">
          <div className="text-2xl md:text-3xl font-bold text-red-400">{enhancedReport.enhancedWCAG.failedTests}</div>
          <div className="text-xs md:text-sm text-zinc-400">Failed</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 text-center border border-zinc-700">
          <div className={`text-2xl md:text-3xl font-bold ${gradeInfo.color}`}>{enhancedReport.enhancedWCAG.overallScore}%</div>
          <div className="text-xs md:text-sm text-zinc-400">Score</div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h4 className="text-lg font-medium text-zinc-100 mb-6 flex items-center gap-2">
          ⚠️ Risk Assessment
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="text-sm text-zinc-400">Legal Risk</div>
            </div>
            <div className={`text-xl md:text-2xl font-bold ${getRiskColor(enhancedReport.enhancedWCAG.riskAssessment.legalRisk)}`}>
              {enhancedReport.enhancedWCAG.riskAssessment.legalRisk}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {enhancedReport.enhancedWCAG.riskAssessment.legalRisk === 'High' ? 'Immediate action required' : 
               enhancedReport.enhancedWCAG.riskAssessment.legalRisk === 'Medium' ? 'Review recommended' : 'Low risk'}
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="text-sm text-zinc-400">User Experience</div>
            </div>
            <div className={`text-xl md:text-2xl font-bold ${getRiskColor(enhancedReport.enhancedWCAG.riskAssessment.userExperience)}`}>
              {enhancedReport.enhancedWCAG.riskAssessment.userExperience}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {enhancedReport.enhancedWCAG.riskAssessment.userExperience === 'Poor' ? 'Significant issues' : 
               enhancedReport.enhancedWCAG.riskAssessment.userExperience === 'Moderate' ? 'Some improvements needed' : 'Good experience'}
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="text-sm text-zinc-400">Brand Risk</div>
            </div>
            <div className={`text-xl md:text-2xl font-bold ${getRiskColor(enhancedReport.enhancedWCAG.riskAssessment.brandRisk)}`}>
              {enhancedReport.enhancedWCAG.riskAssessment.brandRisk}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {enhancedReport.enhancedWCAG.riskAssessment.brandRisk === 'High' ? 'Brand impact likely' : 'Minimal brand risk'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
