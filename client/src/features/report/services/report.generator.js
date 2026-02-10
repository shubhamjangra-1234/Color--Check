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
    
    // Calculate WCAG results from existing data
    const wcagResults = this.calculateWCAGResults(contrastResults);
    
    // Analyze text
    const textAnalysis = {
      extractedText: extractedText || 'No text detected',
      hasText: Boolean(extractedText && extractedText.trim().length > 0),
      textLength: extractedText?.length || 0,
    };
    
    return {
      imageName,
      extractedPalette: colors,
      colorComparisons: colorComparison,
      contrastResults,
      wcagResults,
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
   * @returns {Object} WCAG compliance summary
   */
  static calculateWCAGResults(contrastResults) {
    let totalTests = 0;
    let passedTests = 0;
    const failures = [];
    
    // Handle frontend structure: [{extractedColor, contrasts: [{color, contrast, feedback}]}]
    if (contrastResults && contrastResults.length > 0) {
      contrastResults.forEach(result => {
        if (result.contrasts && result.contrasts.length > 0) {
          result.contrasts.forEach(contrast => {
            totalTests++;
            if (contrast.feedback && contrast.feedback.includes('Pass')) {
              passedTests++;
            } else {
              failures.push({
                color1: result.extractedColor,
                color2: contrast.color,
                contrast: contrast.contrast,
                issue: contrast.feedback === 'Fail ❌' ? 'WCAG AA compliance failed' : 'WCAG AA compliance warning',
              });
            }
          });
        }
      });
    }
    
    const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    
    return {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      passRate: Math.round(passRate),
      wcagCompliant: passRate >= 100,
      failures
    };
  }
}
