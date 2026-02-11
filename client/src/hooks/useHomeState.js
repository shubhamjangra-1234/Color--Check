import { useState, useMemo } from 'react';
import { ReportGenerator } from '../features/report';

export const useHomeState = () => {
  const [file, setFile] = useState(null);
  const [firstImage, setFirstImage] = useState("");
  const [colors, setColors] = useState([]);
  const [colorComparison, setColorComparison] = useState([]);
  const [contrastResults, setContrastResults] = useState([]);
  const [extractedText, setExtractedText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [colorBlindnessMode, setColorBlindnessMode] = useState('normal');

  // Memoized report generation
  const accessibilityReport = useMemo(() => {
    if (!colors.length && !extractedText) return null;
    
    return ReportGenerator.generateReport({
      firstImage,
      colors,
      colorComparison,
      contrastResults,
      extractedText,
      suggestions,
    });
  }, [firstImage, colors, colorComparison, contrastResults, extractedText, suggestions]);

  const handleShowReport = () => {
    setShowReport(true);
  };

  return {
    // State
    file,
    setFile,
    firstImage,
    setFirstImage,
    colors,
    setColors,
    colorComparison,
    setColorComparison,
    contrastResults,
    setContrastResults,
    extractedText,
    setExtractedText,
    suggestions,
    setSuggestions,
    showReport,
    setShowReport,
    isAnalyzing,
    setIsAnalyzing,
    colorBlindnessMode,
    setColorBlindnessMode,
    accessibilityReport,
    handleShowReport
  };
};
