import jsPDF from 'jspdf';

export class ReportExportService {
  /**
   * Export accessibility report as JSON
   * @param {Object} report - Accessibility report data
   * @param {string} imageName - Name of analyzed image
   */
  static exportAsJSON(report, imageName) {
    try {
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const sanitizedImageName = imageName.replace(/[^a-zA-Z0-9]/g, '-');
      const filename = `accessibility-report-${sanitizedImageName}-${timestamp}.json`;
      
      const jsonString = JSON.stringify(report, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export report:', error);
      throw new Error('Failed to export accessibility report');
    }
  }

  /**
   * Export accessibility report as PDF
   * @param {Object} report - Accessibility report data
   * @param {string} imageName - Name of analyzed image
   */
  static exportAsPDF(report, imageName) {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const sanitizedImageName = imageName.replace(/[^a-zA-Z0-9]/g, '-');
      const filename = `accessibility-report-${sanitizedImageName}-${timestamp}.pdf`;

      // Initialize jsPDF
      const doc = new jsPDF();
      
      // Set font sizes and colors
      const titleFontSize = 20;
      const headingFontSize = 16;
      const bodyFontSize = 12;
      const primaryColor = [75, 0, 130]; // Violet color
      const textColor = [31, 41, 55]; // Zinc color
      
      // Add title
      doc.setFontSize(titleFontSize);
      doc.setTextColor(...primaryColor);
      doc.text('Accessibility Report', 20, 30);
      
      // Add metadata
      doc.setFontSize(headingFontSize);
      doc.setTextColor(...textColor);
      doc.text(`Image: ${imageName}`, 20, 50);
      doc.text(`Generated: ${new Date(report.timestamp).toLocaleString()}`, 20, 60);
      
      // Add WCAG Score
      doc.setFontSize(headingFontSize);
      doc.text('Overall WCAG Score', 20, 80);
      doc.setFontSize(bodyFontSize + 4);
      doc.setTextColor(
        report.wcagResults.overallScore >= 80 ? 0 : 
        report.wcagResults.overallScore >= 60 ? 255 : 255,
        report.wcagResults.overallScore >= 80 ? 128 : 
        report.wcagResults.overallScore >= 60 ? 140 : 0,
        report.wcagResults.overallScore >= 80 ? 0 : 0
      );
      doc.text(`${report.wcagResults.overallScore}%`, 20, 90);
      
      // Add color palette
      doc.setFontSize(headingFontSize);
      doc.setTextColor(...textColor);
      doc.text('Color Palette', 20, 110);
      let yPos = 120;
      report.extractedPalette.forEach((color, index) => {
        doc.setFontSize(bodyFontSize);
        doc.text(`${index + 1}. ${color}`, 25, yPos);
        yPos += 8;
      });
      
      // Add contrast issues
      if (report.wcagResults.failures.length > 0) {
        yPos += 10;
        doc.setFontSize(headingFontSize);
        doc.text('Contrast Issues', 20, yPos);
        yPos += 10;
        
        report.wcagResults.failures.forEach((failure, index) => {
          doc.setFontSize(bodyFontSize);
          doc.text(`${index + 1}. ${failure.color1} vs ${failure.color2}`, 25, yPos);
          doc.text(`   Contrast: ${failure.contrast}:1 - ${failure.issue}`, 25, yPos + 5);
          yPos += 12;
        });
      }
      
      // Add text analysis
      yPos += 10;
      doc.setFontSize(headingFontSize);
      doc.text('Text Analysis', 20, yPos);
      yPos += 10;
      doc.setFontSize(bodyFontSize);
      doc.text(`Text Detected: ${report.textAnalysis.hasText ? 'Yes' : 'No'}`, 25, yPos);
      doc.text(`Character Count: ${report.textAnalysis.textLength}`, 25, yPos + 5);
      
      if (report.textAnalysis.extractedText && report.textAnalysis.extractedText !== 'No text detected') {
        yPos += 10;
        doc.text('Extracted Text:', 25, yPos);
        yPos += 5;
        
        // Split long text into lines
        const lines = doc.splitTextToSize(report.textAnalysis.extractedText, 170);
        lines.forEach(line => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 25, yPos);
          yPos += 5;
        });
      }
      
      // Save the PDF
      doc.save(filename);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      throw new Error('Failed to export PDF report');
    }
  }

  /**
   * Prepare data for future PDF export
   * @param {Object} report - Accessibility report data
   * @returns {Object} Structured data ready for PDF generation
   */
  static prepareForPDF(report) {
    return {
      title: 'Accessibility Report',
      metadata: {
        imageName: report.imageName,
        generatedAt: report.timestamp,
        totalColors: report.extractedPalette.length,
      },
      sections: {
        summary: {
          wcagScore: report.wcagResults.overallScore,
          passedTests: report.wcagResults.passedTests,
          totalTests: report.wcagResults.totalTests,
        },
        colorPalette: report.extractedPalette,
        contrastFailures: report.wcagResults.failures,
        textAnalysis: report.textAnalysis,
        suggestions: report.colorSuggestions,
      },
    };
  }

  /**
   * Generate filename for exports
   * @param {string} imageName - Name of analyzed image
   * @param {string} format - Export format (json, pdf, etc.)
   * @returns {string} Generated filename
   */
  static generateFilename(imageName, format = 'json') {
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedImageName = imageName.replace(/[^a-zA-Z0-9]/g, '-');
    return `accessibility-report-${sanitizedImageName}-${timestamp}.${format}`;
  }
}
