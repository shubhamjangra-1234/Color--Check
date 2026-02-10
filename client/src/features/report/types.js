export const ColorComparison = {
  extractedColor: '',
  similarities: [{
    color: '',
    similarity: '',
  }],
  feedback: '',
};

export const ContrastResult = {
  extractedColor: '',
  contrasts: [{
    color: '',
    contrast: '',
    feedback: '',
  }],
};

export const ColorSuggestion = {
  color: '',
  suggestion: '',
};

export const AccessibilityReport = {
  imageName: '',
  extractedPalette: [],
  colorComparisons: [],
  contrastResults: [],
  wcagResults: {
    overallScore: 0,
    passedTests: 0,
    totalTests: 0,
    failures: [],
  },
  textAnalysis: {
    extractedText: '',
    hasText: false,
    textLength: 0,
  },
  colorSuggestions: [],
  timestamp: '',
};

export const ReportSummary = {
  wcagScore: 0,
  totalColors: 0,
  contrastFailures: 0,
  hasText: false,
  suggestionsCount: 0,
};
