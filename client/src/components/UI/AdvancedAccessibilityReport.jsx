import React, { useState } from 'react';
import { useAdvancedReportGenerator } from '../../hooks/useAdvancedReportGenerator';
import { ReportExportService } from '../../features/report/services/pdf.export';
import OverviewTab from './AdvancedAccessibilityReport/OverviewTab';
import TextAnalysisTab from './AdvancedAccessibilityReport/TextAnalysisTab';
import ColorBlindnessTab from './AdvancedAccessibilityReport/ColorBlindnessTab';
import HeatmapTab from './AdvancedAccessibilityReport/HeatmapTab';
import RecommendationsTab from './AdvancedAccessibilityReport/RecommendationsTab';
import TechnicalSpecsTab from './AdvancedAccessibilityReport/TechnicalSpecsTab';

const AdvancedAccessibilityReport = ({ report, onClose }) => {
  const { enhancedReport, getAccessibilityGrade, exportFormats } = useAdvancedReportGenerator(report);
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);

  if (!enhancedReport) return null;

  const gradeInfo = getAccessibilityGrade(enhancedReport.enhancedWCAG.overallScore);

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      if (format === 'pdf') {
        await ReportExportService.exportAsPDF(enhancedReport, report.imageName);
      } else if (format === 'json') {
        ReportExportService.exportAsJSON(enhancedReport, report.imageName);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Failed to export ${format.toUpperCase()}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-zinc-400';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'textAnalysis', label: 'Text Analysis', icon: '📝' },
    { id: 'colorBlindness', label: 'Color Blindness', icon: '👁' },
    { id: 'heatmap', label: 'Contrast Heatmap', icon: '🌡️' },
    { id: 'recommendations', label: 'Recommendations', icon: '💡' },
    { id: 'technical', label: 'Technical Specs', icon: '⚙️' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-800 border-b border-zinc-700 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                Advanced Accessibility Report
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

        {/* Tab Navigation */}
        <div className="border-b border-zinc-700 bg-zinc-800/50">
          <div className="grid grid-cols-3 md:grid-cols-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-3 text-xs md:text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-zinc-100 bg-zinc-700 border-violet-500'
                    : 'text-zinc-400 border-transparent hover:text-zinc-300 hover:bg-zinc-700/50'
                }`}
              >
                <span className="text-base md:text-lg">{tab.icon}</span>
                <span className="hidden sm:inline truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>


        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <OverviewTab 
              enhancedReport={enhancedReport}
              gradeInfo={gradeInfo}
              getRiskColor={getRiskColor}
              getScoreColor={getScoreColor}
            />
          )}

          {/* Text Analysis Tab */}
          {activeTab === 'textAnalysis' && (
            <TextAnalysisTab 
              report={report}
              getScoreColor={getScoreColor}
              getRiskColor={getRiskColor}
            />
          )}

          {/* Color Blindness Tab */}
          {activeTab === 'colorBlindness' && (
            <ColorBlindnessTab report={report} />
          )}

          {/* Contrast Heatmap Tab */}
          {activeTab === 'heatmap' && (
            <HeatmapTab />
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <RecommendationsTab report={report} />
          )}

          {/* Technical Specs Tab */}
          {activeTab === 'technical' && (
            <TechnicalSpecsTab 
              enhancedReport={enhancedReport}
              report={report}
              getScoreColor={getScoreColor}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-zinc-800 border-t border-zinc-700 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Export Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('json')}
                  disabled={isExporting}
                  className="px-3 md:px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-zinc-100 rounded-lg hover:from-violet-700 hover:to-violet-800 disabled:from-zinc-600 disabled:to-zinc-700 transition-all duration-300 flex items-center gap-2 shadow-md disabled:cursor-not-allowed text-sm"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-zinc-200"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Export JSON</span>
                      <span className="sm:hidden">JSON</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="px-3 md:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-zinc-100 rounded-lg hover:from-red-700 hover:to-red-800 disabled:from-zinc-600 disabled:to-zinc-700 transition-all duration-300 flex items-center gap-2 shadow-md disabled:cursor-not-allowed text-sm"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-zinc-200"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden sm:inline">Export PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAccessibilityReport;
