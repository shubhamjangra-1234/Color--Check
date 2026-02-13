import { useState, useCallback, useMemo } from 'react';

export const useColorBlindnessSimulation = (colors) => {
  const [simulationMode, setSimulationMode] = useState('normal');
  const [isProcessing, setIsProcessing] = useState(false);

  // Color transformation matrices for different types of color blindness
  const transformationMatrices = useMemo(() => ({
    normal: {
      r: [1, 0, 0],
      g: [0, 1, 0], 
      b: [0, 0, 1]
    },
    protanopia: {
      r: [0.567, 0.433, 0],
      g: [0.558, 0.442, 0],
      b: [0, 0.242, 0.034]
    },
    deuteranopia: {
      r: [0.625, 0.375, 0],
      g: [0.7, 0.3, 0],
      b: [0, 0.3, 0.3]
    },
    tritanopia: {
      r: [0.95, 0.05, 0],
      g: [0, 0.433, 0.567],
      b: [0, 0.475, 0.525]
    },
    achromatopsia: {
      r: [0.299, 0.587, 0.114],
      g: [0.299, 0.587, 0.114],
      b: [0.299, 0.587, 0.114]
    }
  }), []);

  const applyColorTransformation = useCallback((hexColor, matrix) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Apply transformation matrix
    const newR = Math.round(Math.max(0, Math.min(255, 
      r * matrix.r[0] + g * matrix.r[1] + b * matrix.r[2]
    )));
    const newG = Math.round(Math.max(0, Math.min(255, 
      r * matrix.g[0] + g * matrix.g[1] + b * matrix.g[2]
    )));
    const newB = Math.round(Math.max(0, Math.min(255, 
      r * matrix.b[0] + g * matrix.b[1] + b * matrix.b[2]
    )));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }, []);

  const simulateColors = useCallback(async () => {
    if (!colors.length || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate processing delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const matrix = transformationMatrices[simulationMode];
      const simulatedColors = colors.map(color => ({
        original: color,
        simulated: applyColorTransformation(color, matrix),
        mode: simulationMode
      }));
      
      return simulatedColors;
    } catch (error) {
      console.error('Color simulation failed:', error);
      return colors.map(color => ({ original: color, simulated: color, mode: 'normal' }));
    } finally {
      setIsProcessing(false);
    }
  }, [colors, simulationMode, isProcessing, transformationMatrices, applyColorTransformation]);

  const getModeDescription = useCallback((mode) => {
    const descriptions = {
      normal: 'Normal Vision - Standard color perception',
      protanopia: 'Protanopia - Red color blindness (affects ~1% of males)',
      deuteranopia: 'Deuteranopia - Green color blindness (affects ~1% of males)',
      tritanopia: 'Tritanopia - Blue color blindness (rare, affects <0.01% of population)',
      achromatopsia: 'Achromatopsia - Complete color blindness (very rare)'
    };
    return descriptions[mode] || descriptions.normal;
  }, []);

  return {
    simulationMode,
    setSimulationMode,
    isProcessing,
    simulateColors,
    getModeDescription,
    availableModes: Object.keys(transformationMatrices)
  };
};
