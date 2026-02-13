import { useState, useCallback, useMemo } from 'react';
import { calculateContrast } from '../utils/colorUtils';

export const useContrastHeatmap = (firstImage, contrastResults) => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHeatmap = useCallback(async () => {
    if (!firstImage || !contrastResults.length) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve) => {
        img.onload = resolve;
        img.crossOrigin = 'anonymous';
        img.src = firstImage;
      });
      
      // Downscale for performance
      const scaleFactor = Math.min(1, 800 / Math.max(img.width, img.height));
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const heatmapData = ctx.createImageData(canvas.width, canvas.height);
      
      // Create contrast heatmap overlay
      for (let y = 0; y < canvas.height; y += 4) { // Sample every 4 pixels for performance
        for (let x = 0; x < canvas.width; x += 4) {
          const idx = (y * canvas.width + x) * 4;
          const r = imageData.data[idx];
          const g = imageData.data[idx + 1];
          const b = imageData.data[idx + 2];
          
          // Calculate local contrast (simplified)
          const brightness = (r + g + b) / 3;
          
          // Find worst contrast in results for this area
          let worstContrast = 1;
          contrastResults.forEach(result => {
            result.contrasts?.forEach(contrast => {
              const contrastValue = parseFloat(contrast.contrast);
              if (contrastValue < worstContrast) {
                worstContrast = contrastValue;
              }
            });
          });
          
          // Apply heatmap color based on contrast quality
          let heatmapColor;
          if (worstContrast >= 4.5) {
            // Green - Good contrast
            heatmapColor = { r: 0, g: 255, b: 0, a: 100 };
          } else if (worstContrast >= 3.0) {
            // Yellow - Medium contrast  
            heatmapColor = { r: 255, g: 255, b: 0, a: 100 };
          } else {
            // Red - Poor contrast
            heatmapColor = { r: 255, g: 0, b: 0, a: 100 };
          }
          
          // Apply heatmap with transparency
          const alpha = 0.3; // Subtle overlay
          heatmapData.data[idx] = heatmapColor.r;
          heatmapData.data[idx + 1] = heatmapColor.g;
          heatmapData.data[idx + 2] = heatmapColor.b;
          heatmapData.data[idx + 3] = Math.round(brightness * alpha + (255 * (1 - alpha)));
        }
      }
      
      // Calculate overall worst contrast for stats
      let overallWorstContrast = 1;
      let overallBestContrast = 1;
      contrastResults.forEach(result => {
        result.contrasts?.forEach(contrast => {
          const contrastValue = parseFloat(contrast.contrast);
          if (contrastValue < overallWorstContrast) {
            overallWorstContrast = contrastValue;
          }
          if (contrastValue > overallBestContrast) {
            overallBestContrast = contrastValue;
          }
        });
      });
      
      // Draw heatmap overlay
      ctx.putImageData(heatmapData, 0, 0);
      
      return {
        heatmapUrl: canvas.toDataURL(),
        worstContrast: overallWorstContrast,
        bestContrast: overallBestContrast,
        averageContrast: contrastResults.reduce((sum, result) => {
          const avgContrast = result.contrasts?.reduce((cSum, contrast) => 
            cSum + parseFloat(contrast.contrast), 0) / (result.contrasts?.length || 1);
          return sum + avgContrast;
        }, 0) / contrastResults.length
      };
    } catch (error) {
      console.error('Heatmap generation failed:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [firstImage, contrastResults]);

  const getHeatmapStats = useMemo(() => {
    if (!contrastResults.length) return null;
    
    const allContrasts = contrastResults.flatMap(result => 
      result.contrasts?.map(c => parseFloat(c.contrast)) || []
    );
    
    const good = allContrasts.filter(c => c >= 4.5).length;
    const medium = allContrasts.filter(c => c >= 3.0 && c < 4.5).length;
    const poor = allContrasts.filter(c => c < 3.0).length;
    
    return {
      total: allContrasts.length,
      good,
      medium,
      poor,
      worst: Math.min(...allContrasts),
      best: Math.max(...allContrasts),
      average: allContrasts.reduce((sum, c) => sum + c, 0) / allContrasts.length
    };
  }, [contrastResults]);

  return {
    showHeatmap,
    setShowHeatmap,
    isGenerating,
    generateHeatmap,
    heatmapStats: getHeatmapStats
  };
};
