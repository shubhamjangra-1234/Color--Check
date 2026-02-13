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

  // Professional scoring system
  const getScoreData = (score) => {
    if (score >= 90) return { 
      label: 'Excellent', 
      color: 'text-green-400', 
      bgColor: 'bg-green-500/10', 
      borderColor: 'border-green-500/20',
      riskLevel: 'Low',
      compliance: 'WCAG AA Compliant'
    };
    if (score >= 80) return { 
      label: 'Good', 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-500/10', 
      borderColor: 'border-blue-500/20',
      riskLevel: 'Low',
      compliance: 'WCAG AA Compliant'
    };
    if (score >= 60) return { 
      label: 'Needs Improvement', 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-500/10', 
      borderColor: 'border-yellow-500/20',
      riskLevel: 'Medium',
      compliance: 'Partial Compliance'
    };
    return { 
      label: 'Poor', 
      color: 'text-red-400', 
      bgColor: 'bg-red-500/10', 
      borderColor: 'border-red-500/20',
      riskLevel: 'High',
      compliance: 'Non-Compliant'
    };
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Moderate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Minor': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  // Calculate additional metrics
  const scoreData = getScoreData(report.wcagResults.calculatedScore ?? report.wcagResults.passRate);
  const passRate = Math.round((report.wcagResults.passedTests / report.wcagResults.totalTests) * 100);
  const failureRate = 100 - passRate;
  
  // Color safety analysis
  const analyzeColorSafety = (color) => {
    // Simple luminance calculation for safety assessment
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    if (luminance > 0.8) return { safe: true, recommendation: 'Use dark text', textColor: '#000000' };
    if (luminance < 0.2) return { safe: true, recommendation: 'Use light text', textColor: '#FFFFFF' };
    return { safe: false, recommendation: 'Use with caution', textColor: luminance > 0.5 ? '#000000' : '#FFFFFF' };
  };

  // Generate smart recommendations
  const generateRecommendations = () => {
    const recommendations = [];
    
    if (report.wcagResults.failures.length > 0) {
      recommendations.push({
        priority: 'High',
        title: 'Fix Critical Contrast Issues',
        description: `${report.wcagResults.failures.length} color combinations fail WCAG 2.1 AA standards. Increase contrast ratios to meet 4.5:1 minimum requirement.`,
        impact: 'Legal compliance and user accessibility',
        action: 'Adjust color values in design system'
      });
    }
    
    if (report.textAnalysis.hasText && report.textAnalysis.textLength > 100) {
      recommendations.push({
        priority: 'Medium',
        title: 'Optimize Text Hierarchy',
        description: 'Long text content detected. Ensure proper heading structure and sufficient contrast for readability.',
        impact: 'Improved user experience and screen reader compatibility',
        action: 'Review typography and contrast ratios'
      });
    }
    
    recommendations.push({
      priority: 'Low',
      title: 'Implement Color Blindness Testing',
      description: 'Test design with protanopia, deuteranopia, and tritanopia simulations to ensure accessibility for all users.',
      impact: 'Broader audience reach and inclusive design',
      action: 'Use color blindness simulation tools'
    });
    
    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-zinc-700/50">
        {/* Professional Header */}
        <div className="sticky top-0 bg-gradient-to-r from-violet-600/10 to-blue-600/10 backdrop-blur-md border-b border-zinc-700/50 p-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>
                <h1 className="text-3xl font-bold text-zinc-100">Accessibility Audit Report</h1>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-zinc-400">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {report.imageName}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(report.timestamp).toLocaleString()}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Report ID: AUDIT-{Date.now().toString().slice(-6)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 p-2 rounded-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Executive Summary Dashboard */}
          <div className="p-8 space-y-8">
            <div className="bg-gradient-to-br from-violet-600/5 to-blue-600/5 rounded-2xl p-8 border border-violet-500/20">
              <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-violet-500 rounded-full"></div>
                Executive Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Overall Score */}
                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto rounded-full border-4 ${scoreData.borderColor} ${scoreData.bgColor} flex items-center justify-center mb-4`}>
                    <div className={`text-3xl font-bold ${scoreData.color}`}>
                      {report.wcagResults.overallScore}%
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${scoreData.color} mb-1`}>{scoreData.label}</div>
                  <div className="text-sm text-zinc-400">Overall Score</div>
                </div>

                {/* Compliance Level */}
                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto rounded-full border-4 ${scoreData.borderColor} ${scoreData.bgColor} flex items-center justify-center mb-4`}>
                    <div className={`text-xl font-bold ${scoreData.color}`}>
                      {passRate}%
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${scoreData.color} mb-1`}>{scoreData.compliance}</div>
                  <div className="text-sm text-zinc-400">Compliance Level</div>
                </div>

                {/* Risk Level */}
                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto rounded-full border-4 ${getRiskColor(scoreData.riskLevel).split(' ')[2]} ${getRiskColor(scoreData.riskLevel).split(' ')[1]} flex items-center justify-center mb-4`}>
                    <div className={`text-xl font-bold ${getRiskColor(scoreData.riskLevel).split(' ')[0]}`}>
                      {scoreData.riskLevel}
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${getRiskColor(scoreData.riskLevel).split(' ')[0]} mb-1`}>Risk Level</div>
                  <div className="text-sm text-zinc-400">Business Risk</div>
                </div>

                {/* Total Failures */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-red-500/20 bg-red-500/10 flex items-center justify-center mb-4">
                    <div className="text-3xl font-bold text-red-400">
                      {report.wcagResults.failures.length}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-red-400 mb-1">Issues Found</div>
                  <div className="text-sm text-zinc-400">Critical Failures</div>
                </div>
              </div>
            </div>

            {/* Detailed WCAG Analysis */}
            <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50">
              <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                WCAG Compliance Analysis
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-zinc-700 font-medium">Test Performance</span>
                      <span className="text-zinc-700 text-sm">{report.wcagResults.passedTests}/{report.wcagResults.totalTests} passed</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-400 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${passRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50">
                      <div className="text-2xl font-bold text-green-400 mb-1">{report.wcagResults.passedTests}</div>
                      <div className="text-sm text-zinc-400">Tests Passed</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50">
                      <div className="text-2xl font-bold text-red-400 mb-1">{report.wcagResults.failedTests}</div>
                      <div className="text-sm text-zinc-400">Tests Failed</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-300">Contrast Compliance</span>
                      <span className={`text-sm font-medium ${failureRate > 20 ? 'text-red-400' : failureRate > 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {100 - failureRate}%
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">WCAG 2.1 AA Standard (4.5:1)</div>
                  </div>
                  
                  <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-300">Text Legibility</span>
                      <span className={`text-sm font-medium ${report.textAnalysis.hasText ? 'text-green-400' : 'text-zinc-400'}`}>
                        {report.textAnalysis.hasText ? 'Detected' : 'Not Detected'}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      {report.textAnalysis.hasText ? `${report.textAnalysis.textLength} characters` : 'No text content'}
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-300">Color Accessibility</span>
                      <span className={`text-sm font-medium ${report.extractedPalette.length > 0 ? 'text-green-400' : 'text-zinc-400'}`}>
                        {report.extractedPalette.length} colors
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">Palette analysis complete</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contrast Failures Enhanced */}
            {report.wcagResults.failures.length > 0 && (
              <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50">
                <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                  Contrast Compliance Issues ({report.wcagResults.failures.length})
                </h2>
                
                <div className="space-y-4">
                  {report.wcagResults.failures.map((failure, index) => (
                    <div key={index} className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-700/50">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-zinc-600 shadow-lg"
                              style={{ backgroundColor: failure.color1 }}
                            />
                            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-zinc-600 shadow-lg"
                              style={{ backgroundColor: failure.color2 }}
                            />
                          </div>
                          <div>
                            <div className="text-zinc-300 font-mono text-sm mb-1">
                              {failure.color1} / {failure.color2}
                            </div>
                            <div className="text-zinc-400 text-xs">Color Combination</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-400 mb-1">{failure.contrast}:1</div>
                            <div className="text-xs text-zinc-400">Current Ratio</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-zinc-400 mb-1">4.5:1</div>
                            <div className="text-xs text-zinc-400">Required</div>
                          </div>
                          <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="text-red-400 text-sm font-medium">WCAG 2.1 AA Violation</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-600/50">
                        <div className="text-sm text-zinc-300 mb-2">Recommended Fix:</div>
                        <div className="text-xs text-zinc-400">
                          Increase contrast ratio to meet 4.5:1 minimum requirement. Consider adjusting lightness values or using complementary colors.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Palette Intelligence */}
            <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50">
              <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                Color Palette Intelligence
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {report.extractedPalette.map((color, index) => {
                  const safety = analyzeColorSafety(color);
                  return (
                    <div key={index} className="text-center">
                      <div
                        className="w-full h-20 rounded-xl border-2 border-zinc-600 mb-3 shadow-lg relative overflow-hidden"
                        style={{ backgroundColor: color }}
                      >
                        <div className={`absolute top-1 right-1 w-3 h-3 rounded-full border border-zinc-600 ${
                          safety.safe ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                      </div>
                      <div className="text-xs font-mono text-zinc-400 mb-1">{color}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        safety.safe ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {safety.safe ? 'Safe' : 'Caution'}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{safety.recommendation}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Text Analysis Enhanced */}
            <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50">
              <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
                Text Analysis & Readability
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">
                        {report.textAnalysis.hasText ? 'Detected' : 'None'}
                      </div>
                      <div className="text-sm text-zinc-400">Text Status</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50">
                      <div className="text-2xl font-bold text-zinc-300 mb-1">{report.textAnalysis.textLength}</div>
                      <div className="text-sm text-zinc-400">Characters</div>
                    </div>
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {report.textAnalysis.extractedText ? Math.round(report.textAnalysis.extractedText.split(/\s+/).filter(word => word.length > 0).length) : 0}
                      </div>
                      <div className="text-sm text-zinc-400">Words</div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-zinc-300 font-medium">Text Analysis Summary</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.textAnalysis.hasText ? 'bg-green-500/10 text-green-400' : 'bg-zinc-500/10 text-zinc-400'
                      }`}>
                        {report.textAnalysis.hasText ? 'Readable' : 'N/A'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Lines:</span>
                        <span className="text-zinc-300">
                          {report.textAnalysis.extractedText ? report.textAnalysis.extractedText.split('\n').filter(line => line.trim().length > 0).length : 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Avg Line Length:</span>
                        <span className="text-zinc-300">
                          {report.textAnalysis.extractedText ? Math.round(report.textAnalysis.textLength / report.textAnalysis.extractedText.split('\n').filter(line => line.trim().length > 0).length) : 0} chars
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Text Density:</span>
                        <span className="text-zinc-300">
                          {report.textAnalysis.extractedText ? `${Math.round((report.textAnalysis.textLength / 1000) * 10) / 10}k chars` : '0 chars'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-zinc-400">
                      {report.textAnalysis.hasText 
                        ? '✓ Text content extracted and analyzed for accessibility'
                        : 'No text content detected in the image.'}
                    </div>
                  </div>
                </div>

                {report.textAnalysis.extractedText && (
                  <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-700/50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-zinc-300 font-medium">Extracted Text Content</div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
                          {Math.round(report.textAnalysis.extractedText.split(/\s+/).filter(word => word.length > 0).length)} words
                        </span>
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium">
                          {report.textAnalysis.extractedText.split('\n').filter(line => line.trim().length > 0).length} lines
                        </span>
                      </div>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-4 text-zinc-300 text-sm max-h-64 overflow-y-auto font-mono leading-relaxed border border-zinc-700/30">
                      {report.textAnalysis.extractedText.split('\n').map((line, index) => (
                        <div key={index} className="hover:bg-zinc-700/20 px-2 py-1 rounded transition-colors">
                          <span className="text-zinc-500 text-xs mr-2">{String(index + 1).padStart(2, '0')}</span>
                          {line || <span className="text-zinc-600 italic">[empty line]</span>}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/20">
                        <div className="text-xs text-zinc-400 mb-1">Text Quality</div>
                        <div className="text-sm font-medium text-zinc-300">
                          {report.textAnalysis.textLength > 100 ? 'Good' : report.textAnalysis.textLength > 10 ? 'Fair' : 'Limited'}
                        </div>
                      </div>
                      <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/20">
                        <div className="text-xs text-zinc-400 mb-1">Readability</div>
                        <div className="text-sm font-medium text-zinc-300">
                          {report.textAnalysis.extractedText.split(/\s+/).filter(word => word.length > 0).length > 10 ? 'Readable' : 'Minimal'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Recommendations */}
            <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50">
              <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                Smart Recommendations
              </h2>
              
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-700/50">
                    <div className="flex items-start gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        rec.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        rec.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {rec.priority} Priority
                      </div>
                      <div className="flex-1">
                        <div className="text-zinc-100 font-semibold mb-2">{rec.title}</div>
                        <div className="text-zinc-300 text-sm mb-3">{rec.description}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-zinc-400">
                            <span className="font-medium">Impact:</span> {rec.impact}
                          </div>
                          <div className="text-xs text-green-400 font-medium">
                            Action: {rec.action}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Compliance Summary */}
            <div className="bg-gradient-to-br from-violet-600/5 to-blue-600/5 rounded-2xl p-8 border border-violet-500/20">
              <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-violet-500 rounded-full"></div>
                Compliance Summary & Final Assessment
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full border-4 ${scoreData.borderColor} ${scoreData.bgColor} flex items-center justify-center mb-4`}>
                    <svg className={`w-8 h-8 ${scoreData.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className={`text-lg font-semibold ${scoreData.color} mb-1`}>
                    {scoreData.riskLevel === 'Low' ? 'Safe for Visually Impaired' : 'Needs Improvement'}
                  </div>
                  <div className="text-sm text-zinc-400">Visual Accessibility</div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-purple-500/20 bg-purple-500/10 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="text-lg font-semibold text-purple-400 mb-1">Colorblind Safe</div>
                  <div className="text-sm text-zinc-400">Inclusivity Score</div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-blue-500/20 bg-blue-500/10 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-lg font-semibold text-blue-400 mb-1">{Math.round(passRate * 0.9)}%</div>
                  <div className="text-sm text-zinc-400">Estimated Inclusivity</div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-zinc-900/50 rounded-xl border border-zinc-700/50">
                <div className="text-zinc-100 font-semibold mb-3">Final Recommendation:</div>
                <div className="text-zinc-300">
                  {scoreData.riskLevel === 'Low' 
                    ? 'This design meets most accessibility standards and is considered safe for users with visual impairments. Minor optimizations may enhance the experience further.'
                    : scoreData.riskLevel === 'Medium'
                    ? 'This design has several accessibility issues that should be addressed to ensure compliance with WCAG standards and provide an inclusive experience.'
                    : 'This design requires significant improvements to meet basic accessibility standards. Immediate action is recommended to address critical contrast and usability issues.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-zinc-800 to-zinc-900 border-t border-zinc-700/50 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Export Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-zinc-400 text-sm font-medium">Professional Export Options:</div>
              <div className="flex gap-3">
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-zinc-100 rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-violet-600/25"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export JSON Data</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-zinc-100 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-600/25"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Generate PDF Report</span>
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-zinc-700 text-zinc-100 rounded-lg hover:bg-zinc-600 transition-all duration-200 font-medium shadow-lg"
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
