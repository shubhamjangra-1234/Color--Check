import { calculateContrast } from '../../../utils/colorUtils';

export class ReportGenerator {
  /**
   * Generate accessibility report from existing analysis data
   * @param {Object} data - Existing analysis data from Home component
   * @returns {Object} Complete accessibility report
   */
  static generateReport(data) {
    const { firstImage, colors, colorComparison, contrastResults, extractedText, suggestions } = data;
    
    // Extract image name from URL or use default
    const imageName = this.extractImageName(firstImage);
    
    // Analyze text
    const textAnalysis = {
      extractedText: extractedText || 'No text detected',
      hasText: Boolean(extractedText && extractedText.trim().length > 0),
      textLength: extractedText?.length || 0,
    };
    
    // Calculate WCAG results from existing data (pass textAnalysis for classification)
    const wcagResults = this.calculateWCAGResults(contrastResults, textAnalysis);
    
    // Calculate weighted overall score
    const calculatedScore = this.calculateOverallScore({
      wcagResults,
      textAnalysis,
      extractedPalette: colors,
      colorBlindnessSimulation: null // Will be enhanced later
    });
    
    return {
      imageName,
      extractedPalette: colors,
      colorComparisons: colorComparison,
      contrastResults,
      wcagResults: {
        ...wcagResults,
        calculatedScore // Add new field for weighted scoring
      },
      textAnalysis,
      colorSuggestions: suggestions,
      timestamp: new Date().toISOString(),
    };
  }
  
  /**
   * Extract image name from URL or path
   */
  static extractImageName(imageUrl) {
    if (!imageUrl) return 'unknown-image';
    
    // Handle blob URLs
    if (imageUrl.startsWith('blob:')) {
      return 'uploaded-image';
    }
    
    // Extract filename from URL
    try {
      const url = new URL(imageUrl);
      const pathname = url.pathname;
      const filename = pathname.split('/').pop() || 'unknown-image';
      return filename.includes('.') ? filename.split('.')[0] : filename;
    } catch {
      // Fallback for malformed URLs
      return imageUrl.split('/').pop()?.split('.')[0] || 'unknown-image';
    }
  }
  
  /**
   * Calculate WCAG compliance results from contrast data
   * @param {Array} contrastResults - Array of contrast results from backend
   * @param {Object} textAnalysis - Text analysis results
   * @returns {Object} WCAG compliance summary
   */
  static calculateWCAGResults(contrastResults, textAnalysis) {
    let totalTests = 0;
    let passedTests = 0;
    const failures = [];
    const textContrastResults = [];
    const decorativeContrastResults = [];
    
    // Helper function for safe division
    const safeDivide = (a, b) => (b > 0 ? a / b : 0);
    
    // Handle frontend structure: [{extractedColor, contrasts: [{color, contrast, feedback}]}]
    if (contrastResults && contrastResults.length > 0) {
      contrastResults.forEach(result => {
        if (result.contrasts && result.contrasts.length > 0) {
          result.contrasts.forEach(contrast => {
            const isTextContrast = textAnalysis?.hasText && this.isTextRelatedContrast(result.extractedColor, contrast.color);
            
            totalTests++;
            
            if (contrast.feedback && contrast.feedback.includes('Pass')) {
              passedTests++;
              
              const contrastData = {
                color1: result.extractedColor,
                color2: contrast.color,
                contrast: contrast.contrast,
                feedback: contrast.feedback,
                isTextContrast
              };
              
              if (isTextContrast) {
                textContrastResults.push(contrastData);
              } else {
                decorativeContrastResults.push(contrastData);
              }
            } else {
              const failureData = {
                color1: result.extractedColor,
                color2: contrast.color,
                contrast: contrast.contrast,
                issue: contrast.feedback === 'Fail ❌' ? 'WCAG AA compliance failed' : 'WCAG AA compliance warning',
                isTextContrast,
                severity: this.getFailureSeverity(contrast.contrast)
              };
              
              failures.push(failureData);
              
              if (isTextContrast) {
                textContrastResults.push({...failureData, isFailure: true});
              } else {
                decorativeContrastResults.push({...failureData, isFailure: true});
              }
            }
          });
        }
      });
    }
    
    const passRate = safeDivide(passedTests * 100, totalTests);
    
    // Calculate text-specific compliance rate
    const textTests = textContrastResults.length;
    const textPasses = textContrastResults.filter(r => !r.isFailure).length;
    const textPassRate = safeDivide(textPasses * 100, textTests) || 85; // Fallback if no text
    
    return {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      passRate: Math.round(passRate),
      wcagCompliant: passRate >= 100,
      failures,
      
      // New fields for weighted scoring
      textContrastResults,
      decorativeContrastResults,
      textPassRate: Math.round(textPassRate),
      decorativePassRate: Math.round(safeDivide(
        decorativeContrastResults.filter(r => !r.isFailure).length * 100,
        decorativeContrastResults.length
      ) || 85),
      compliancePassRate: Math.round(textPassRate), // Only text contrast for compliance
      insightFailureCount: decorativeContrastResults.filter(r => r.isFailure).length
    };
  }
  
  /**
   * Calculate weighted overall score
   * @param {Object} report - Complete accessibility report
   * @returns {number} Weighted overall score (0-100)
   */
  static calculateOverallScore(report) {
    const weights = {
      contrastCompliance: 0.50,    // 50% - WCAG compliance
      textReadability: 0.25,        // 25% - Text accessibility  
      colorBlindnessSafety: 0.15,    // 15% - Color vision deficiency
      paletteQuality: 0.10           // 10% - Color variety
    };
    
    // Helper function for safe calculations
    const safeDivide = (a, b) => (b > 0 ? a / b : 0);
    const safeNumber = (value) => Number.isFinite(value) ? value : 0;
    
    // A) Contrast Compliance Score (50% weight) - ONLY text contrast
    const complianceScore = safeNumber(report.wcagResults?.compliancePassRate || 85);
    
    // B) Text Readability Score (25% weight)
    let textScore = 80; // Default if no text
    if (report.textAnalysis?.hasText) {
      const textPassRate = safeNumber(report.wcagResults?.textPassRate || 80);
      const ocrConfidenceScore = 75; // Estimated OCR confidence
      textScore = (textPassRate * 0.70) + (ocrConfidenceScore * 0.30);
    }
    
    // C) Color Blindness Safety (15% weight)
    let colorBlindScore = 85; // Default if no simulation
    if (report.colorBlindnessSimulation?.simulatedModes?.length > 0) {
      // Calculate weighted average from simulation results
      const safetyScores = report.colorBlindnessSimulation.simulatedModes.map(mode => 
        mode.accessibilityImpact === 'Low' ? 95 :
        mode.accessibilityImpact === 'Medium' ? 75 : 55
      );
      colorBlindScore = safeDivide(
        safetyScores.reduce((sum, score) => sum + score, 0),
        safetyScores.length
      );
    }
    
    // D) Palette Quality Score (10% weight)
    let paletteScore = 80; // Default if no palette
    if (report.extractedPalette?.length > 0) {
      const totalColors = report.extractedPalette.length;
      const accessibleColors = report.extractedPalette.filter(color => {
        // Simple heuristic - check if color has good luminance for text
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.2 && luminance < 0.8; // Not too light or too dark
      }).length;
      
      paletteScore = safeDivide(accessibleColors * 100, totalColors);
    }
    
    // Calculate weighted score
    const weightedScore = 
      (complianceScore * weights.contrastCompliance) +
      (textScore * weights.textReadability) +
      (colorBlindScore * weights.colorBlindnessSafety) +
      (paletteScore * weights.paletteQuality);
    
    // Apply severity-based adjustments
    let finalScore = weightedScore;
    if (report.wcagResults?.failures) {
      const criticalCount = report.wcagResults.failures.filter(f => f.isTextContrast && f.severity === 'Critical').length;
      const moderateCount = report.wcagResults.failures.filter(f => f.isTextContrast && f.severity === 'Moderate').length;
      const minorCount = report.wcagResults.failures.filter(f => f.isTextContrast && f.severity === 'Minor').length;
      
      finalScore -= (criticalCount * 5) + (moderateCount * 3) + (minorCount * 1);
    }
    
    // Clamp between 0 and 100
    finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));
    
    return finalScore;
  }
  
  /**
   * Helper to determine if contrast is text-related
   */
  static isTextRelatedContrast(color1, color2) {
    // Simplified heuristic - in real implementation, this would use actual text detection
    // For now, assume high contrast combinations are more likely text-related
    const contrast = parseFloat(calculateContrast(color1, color2));
    return contrast >= 3.0; // Text typically needs higher contrast
  }
  
  /**
   * Get failure severity based on contrast ratio
   */
  static getFailureSeverity(contrast) {
    const ratio = parseFloat(contrast);
    if (ratio < 2.0) return 'Critical';
    if (ratio < 3.0) return 'Moderate';
    return 'Minor';
  }
}
