import React from 'react';
import { useHomeState } from '../../hooks/useHomeState';
import { useColorAnalysis } from '../../hooks/useColorAnalysis';
import { useImageUploadHandler } from '../../hooks/useImageUploadHandler';
import { useTextExtraction } from '../../hooks/useTextExtraction';
import { AccessibilityReport } from '../../features/report';

// Import UI components
import HeroSection from '../../components/UI/HeroSection';
import ImagePreview from '../../components/UI/ImagePreview';
import UploadControls from '../../components/UI/UploadControls';
import ColorDisplay from '../../components/UI/ColorDisplay';
import TextExtractionDisplay from '../../components/UI/TextExtractionDisplay';
import ColorComparisonCharts from '../../components/UI/ColorComparisonCharts';
import ColorSuggestionsDisplay from '../../components/UI/ColorSuggestionsDisplay';
import ContrastResultsDisplay from '../../components/UI/ContrastResultsDisplay';
import ReportAnalysis from '../../components/UI/ReportAnalysis';

function Home() {
  // State management
  const {
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
  } = useHomeState();

  // Color analysis logic
  useColorAnalysis(firstImage, setColors, setColorComparison, setContrastResults, setSuggestions);

  // Image upload handler
  const { handleUpload } = useImageUploadHandler(setFirstImage, setExtractedText, setIsAnalyzing);

  // Text extraction hook for loading state
  const { loading: textLoading } = useTextExtraction();

  // Copy text to clipboard function
  const copyTextToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Text copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy text:", error);
      alert("Failed to copy text. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-2 bg-zinc-900">
      <main className="flex-grow p-2 w-full max-w-6xl">
        {/* Hero Section */}
        <HeroSection />


        {/* Image Preview and Color Display */}
        <div className="flex flex-col lg:flex-row items-center justify-between shadow-sm shadow-zinc-700 p-2 rounded-lg bg-zinc-800">
          <ImagePreview firstImage={firstImage} />
          {firstImage && (
            <ColorDisplay 
              colors={colors}
              colorBlindnessMode={colorBlindnessMode}
              setColorBlindnessMode={setColorBlindnessMode}
            />
          )}
        </div>

        {/* Upload Controls */}
        <UploadControls
          file={file}
          setFile={setFile}
          onUpload={handleUpload}
          isAnalyzing={isAnalyzing}
        />

        {/* Text Extraction Display */}
        <TextExtractionDisplay
          extractedText={extractedText}
          textLoading={textLoading}
          onCopyText={copyTextToClipboard}
        />

        {/* Color Comparison Charts */}
        <ColorComparisonCharts colorComparison={colorComparison} />

        {/* Color Suggestions */}
        <ColorSuggestionsDisplay suggestions={suggestions} />

        {/* Report Analysis */}
        <ReportAnalysis
          isAnalyzing={isAnalyzing}
          accessibilityReport={accessibilityReport}
          onShowReport={handleShowReport}
        />

        {/* Contrast Results */}
        <ContrastResultsDisplay contrastResults={contrastResults} />

        {/* Report Basis Section */}
        <div className="p-2 my-4 bg-zinc-900 text-zinc-200">
          <h2 id="report" className="text-4xl font-bold text-zinc-200 mb-4">
            📊 Report Basis
          </h2>
          <p className="text-sm mb-4">
            The reports generated in this application are based on **color
            extraction, contrast ratio calculations, and WCAG accessibility
            guidelines**. This ensures that extracted colors are tested for
            **readability, accessibility, and user-friendly contrast ratios**.
          </p>
          {/* Color Extraction */}
          <div className="mb-6">
            <h3 className="text-2xl text-violet-300 font-semibold mb-2">
              🎨 Color Extraction
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              The system extracts dominant colors from uploaded image using
              **Color Thief**. These colors are then analyzed for similarity
              with predefined colors.
            </p>
          </div>
          {/* Color Comparison */}
          <div className="mb-6">
            <h3 className="text-2xl text-violet-300 font-semibold mb-2">
              🔍 Color Comparison
            </h3>
            <p className="text-gray-300">
              Each extracted color is compared against a **set of predefined
              brand colors** to measure **similarity percentages** and detect
              how closely colors match.
            </p>
          </div>
          {/* Contrast Ratio Calculation */}
          <div className="mb-6">
            <h3 className="text-2xl text-violet-300 font-semibold mb-2">
              📏 Contrast Ratio Calculation (WCAG Compliance)
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              The **contrast ratio** is calculated using **tinycolor.js**,
              following **Web Content Accessibility Guidelines (WCAG 2.1)**
              to determine text readability.
            </p>
          </div>
          {/* Text Extraction */}
          <div className="mb-6">
            <h3 className="text-2xl text-violet-300 font-semibold mb-2">
              📝 Text Extraction
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              The system extracts text from uploaded image using
              **Tesseract.js**. This text can be copied to clipboard for
              further use.
            </p>
          </div>
          {/* Pass/Fail Criteria Table */}
          <div className="mb-6">
            <h3 className="text-2xl text-violet-300 font-semibold mb-2">
              ✅ Pass/Fail Criteria
            </h3>
            <p className="text-gray-300 mb-3">
              The classification is based on WCAG standards:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-gray-700 rounded-lg">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="p-3 border border-gray-700">
                      Contrast Ratio
                    </th>
                    <th className="p-3 border border-gray-700">Result</th>
                    <th className="p-3 border border-gray-700">Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-zinc-800">
                    <td className="p-3 border border-gray-700">
                      4.5:1 or higher
                    </td>
                    <td className="p-3 border border-gray-700 text-green-400">
                      ✅ Pass
                    </td>
                    <td className="p-3 border border-gray-700">
                      Good readability for normal text.
                    </td>
                  </tr>
                  <tr className="bg-zinc-900">
                    <td className="p-3 border border-gray-700">3:1 to 4.5:1</td>
                    <td className="p-3 border border-gray-700 text-yellow-400">
                      ⚠️ Pass (Warning)
                    </td>
                    <td className="p-3 border border-gray-700">
                      Readable for large text but not ideal for small text.
                    </td>
                  </tr>
                  <tr className="bg-zinc-800">
                    <td className="p-3 border border-gray-700">Below 3:1</td>
                    <td className="p-3 border border-gray-700 text-red-400">
                      ❌ Fail
                    </td>
                    <td className="p-3 border border-gray-700">
                      Poor readability, consider increasing contrast.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Accessibility Feedback */}
          <div className="mb-6">
            <h3 className="text-2xl text-violet-300 font-semibold mb-2">
              🛠️ Accessibility Feedback
            </h3>
            <p className="text-gray-300">
              If colors **fail readability tests**, users are advised to:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-300">
              <li>🔹 Increase contrast between text and background.</li>
              <li>
                🔹 Use **high-contrast color combinations** for better
                visibility.
              </li>
              <li>
                🔹 Avoid colors that are **indistinguishable for colorblind
                users**.
              </li>
            </ul>
          </div>
          <p className="mt-6 text-lg text-gray-300 font-semibold">
            **Why This Matters?** Ensuring **better readability, user
            experience, and WCAG compliance** leads to accessible and inclusive
            design. 🚀
          </p>
        </div>
      </main>
      
      {/* Accessibility Report Modal */}
      {showReport && (
        <AccessibilityReport 
          report={accessibilityReport} 
          onClose={() => setShowReport(false)} 
        />
      )}
    </div>
  );
}

export default Home;
