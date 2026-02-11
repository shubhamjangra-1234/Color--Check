import { useEffect } from 'react';
import ColorThief from 'colorthief';
import { PREDEFINED_COLORS } from '../constants';
import { calculateSimilarity, calculateContrast, generateFeedback, suggestBetterColors } from '../utils/colorUtils';

export const useColorAnalysis = (firstImage, setColors, setColorComparison, setContrastResults, setSuggestions) => {
  useEffect(() => {
    if (firstImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Extract colors using ColorThief
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 6);
        
        // Convert RGB arrays to hex
        const hexColors = palette.map(color => {
          const r = color[0];
          const g = color[1];
          const b = color[2];
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        });

        setColors(hexColors);

        // Calculate contrast between all color pairs
        const contrastResults = [];
        for (let i = 0; i < hexColors.length; i++) {
          const contrasts = [];
          for (let j = 0; j < hexColors.length; j++) {
            if (i !== j) {
              const contrast = calculateContrast(hexColors[i], hexColors[j]);
              const feedback = generateFeedback(contrast);
              contrasts.push({
                color: hexColors[j],
                contrast: contrast,
                feedback: feedback
              });
            }
          }
          
          contrastResults.push({
            extractedColor: hexColors[i],
            contrasts: contrasts
          });
        }
        setContrastResults(contrastResults);

        // Compare with predefined colors
        const comparisons = hexColors.map(color => ({
          extractedColor: color,
          similarities: PREDEFINED_COLORS.map(predefined => ({
            color: predefined,
            similarity: calculateSimilarity(color, predefined)
          })).sort((a, b) => b.similarity - a.similarity)
        }));
        setColorComparison(comparisons);

        // Generate suggestions
        const betterColors = suggestBetterColors(hexColors, PREDEFINED_COLORS);
        setSuggestions(betterColors);
      };
      img.src = firstImage;
    }
  }, [firstImage]);
};
