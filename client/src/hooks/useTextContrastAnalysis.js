import { useState, useCallback } from 'react';
import { calculateContrast, generateFeedback } from '../utils/colorUtils';

export const useTextContrastAnalysis = (extractedText, firstImage) => {
  const [textAnalysis, setTextAnalysis] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeTextContrast = useCallback(async () => {
    if (!extractedText || !firstImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // Create canvas for text detection simulation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve) => {
        img.onload = resolve;
        img.crossOrigin = 'anonymous';
        img.src = firstImage;
      });
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Simulate text block detection (simplified OCR result analysis)
      const textBlocks = extractedText.split('\n').filter(line => line.trim().length > 0);
      
      const analysisResults = textBlocks.map((text, index) => {
        // Extract dominant color from text area (simplified sampling)
        const sampleArea = {
          x: Math.max(0, (index * 100) % canvas.width),
          y: Math.max(0, (index * 50) % canvas.height),
          width: Math.min(100, canvas.width - ((index * 100) % canvas.width)),
          height: Math.min(50, canvas.height - ((index * 50) % canvas.height))
        };
        
        const imageData = ctx.getImageData(
          sampleArea.x, 
          sampleArea.y, 
          sampleArea.width, 
          sampleArea.height
        );
        
        // Calculate dominant color in text area
        let r = 0, g = 0, b = 0, pixelCount = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
          r += imageData.data[i];
          g += imageData.data[i + 1];
          b += imageData.data[i + 2];
          pixelCount++;
        }
        
        const textColor = pixelCount > 0 
          ? `#${Math.round(r/pixelCount).toString(16).padStart(2, '0')}${Math.round(g/pixelCount).toString(16).padStart(2, '0')}${Math.round(b/pixelCount).toString(16).padStart(2, '0')}`
          : '#000000';
        
        // Sample background color around text area
        const bgSampleArea = {
          x: Math.max(0, sampleArea.x - 10),
          y: Math.max(0, sampleArea.y - 10),
          width: Math.min(sampleArea.width + 20, canvas.width - (sampleArea.x - 10)),
          height: Math.min(sampleArea.height + 20, canvas.height - (sampleArea.y - 10))
        };
        
        const bgImageData = ctx.getImageData(
          bgSampleArea.x,
          bgSampleArea.y,
          bgSampleArea.width,
          bgSampleArea.height
        );
        
        let bgR = 0, bgG = 0, bgB = 0, bgPixelCount = 0;
        for (let i = 0; i < bgImageData.data.length; i += 4) {
          bgR += bgImageData.data[i];
          bgG += bgImageData.data[i + 1];
          bgB += bgImageData.data[i + 2];
          bgPixelCount++;
        }
        
        const backgroundColor = bgPixelCount > 0
          ? `#${Math.round(bgR/bgPixelCount).toString(16).padStart(2, '0')}${Math.round(bgG/bgPixelCount).toString(16).padStart(2, '0')}${Math.round(bgB/bgPixelCount).toString(16).padStart(2, '0')}`
          : '#FFFFFF';
        
        // Calculate contrast using existing formula
        const contrastRatio = parseFloat(calculateContrast(textColor, backgroundColor));
        const feedback = generateFeedback(contrastRatio);
        
        // Determine text size (simplified heuristic)
        const isLargeText = text.length > 20 || text.includes('\n');
        const threshold = isLargeText ? 3.0 : 4.5;
        
        // Determine risk level
        let riskLevel = 'Low';
        if (contrastRatio < 3.0) riskLevel = 'High';
        else if (contrastRatio < 4.5) riskLevel = 'Medium';
        
        // Determine confidence based on background variance
        let confidence = 'High';
        if (bgPixelCount > 0) {
          const variance = Math.sqrt(
            Math.pow(bgR/bgPixelCount - r, 2) + 
            Math.pow(bgG/bgPixelCount - g, 2) + 
            Math.pow(bgB/bgPixelCount - b, 2)
          ) / bgPixelCount;
          
          if (variance > 50) confidence = 'Moderate';
          if (variance > 100) confidence = 'Low';
        }
        
        return {
          id: `text-${index}`,
          text: text.trim(),
          textColor,
          backgroundColor,
          contrastRatio,
          threshold,
          status: contrastRatio >= threshold ? 'Pass' : 'Fail',
          riskLevel,
          confidence,
          isLargeText
        };
      });
      
      setTextAnalysis(analysisResults);
    } catch (error) {
      console.error('Text contrast analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [extractedText, firstImage]);

  return {
    textAnalysis,
    isAnalyzing,
    analyzeTextContrast,
    overallRisk: textAnalysis.length > 0 
      ? textAnalysis.some(result => result.riskLevel === 'High') ? 'High' :
        textAnalysis.some(result => result.riskLevel === 'Medium') ? 'Medium' : 'Low'
      : 'Low'
  };
};
