import React, { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useTextExtraction } from "../../hooks/useTextExtraction";
import { PREDEFINED_COLORS } from "../../constants";
import { AccessibilityReport, ReportGenerator } from "../../features/report";
import { ColorBlindnessToggle, SimulatedPalette } from "../../features/color-blindness";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ColorThief from "colorthief";
import tinycolor from "tinycolor2";
import { calculateSimilarity, calculateContrast, generateFeedback, suggestBetterColors } from "../../utils/colorUtils";
import { imageService } from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const [file, setFile] = useState(null);
  const [firstImage, setFirstImage] = useState("");
  const [colors, setColors] = useState([]);
  const [colorComparison, setColorComparison] = useState([]);
  const [contrastResults, setContrastResults] = useState([]);
  const [readabilityFeedback, setReadabilityFeedback] = useState([]);
  const [extractedText, setExtractedText] = useState(""); // State to store extracted text
  const { uploadImage, loading: uploadLoading } = useImageUpload();
  const { extractText, loading: textLoading } = useTextExtraction();
  const [suggestions, setSuggestions] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [colorBlindnessMode, setColorBlindnessMode] = useState('normal');

  const handleShowReport = () => {
    setShowReport(true);
  };

  // Memoized report generation to avoid recalculations
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
  }, [firstImage]);

  useEffect(() => {
    if (firstImage && colors.length === 0) {
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

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setIsAnalyzing(true);
    setFirstImage(URL.createObjectURL(file));

    try {
      const uploadResponse = await uploadImage(file);
      const imageUrl = uploadResponse.image;

      // Extract text using Tesseract.js
      const text = await extractText(file);
      setExtractedText(text);

      setFirstImage(`${imageService.baseURL}/Images/${imageUrl}`);
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to copy text to clipboard
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
        <h1 className="text-7xl my-6 text-center text-zinc-200">
          Welcome to Color Checker
        </h1>
        <h2 className="text-4xl mb-4 text-center text-zinc-200">
          Analyze and Compare Colors Effortlessly
        </h2>
        <p className="text-sm text-center mb-6 text-gray-400">
          Upload an image to analyze its colors, extract the text inside the
          image and compare them with predefined colors.
        </p>
        <div className="flex justify-center space-x-4 mb-20">
          <button
            className="px-6 py-2 bg-violet-700 border-2 border-violet-700 text-zinc-200 rounded-md drop-shadow-md hover:bg-violet-800 transition duration-300"
            onClick={() =>
              document
                .getElementById("upload")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Upload
          </button>
          <button
            className="px-6 py-3 text-zinc-100"
            onClick={() =>
              document
                .getElementById("report")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Learn More
          </button>
        </div>
        <div className="mb-8 p-4 bg-zinc-800 text-zinc-300 rounded-lg shadow-xl">
          <p className="text-sm">
            The **Color Checker** project is a tool that analyzes colors from
            uploaded images, compares them with predefined colors, and generates
            a percentage-based similarity chart. It also includes features like
            contrast ratio calculation for WCAG compliance, text readability
            analysis, and text extraction from images, making it a comprehensive
            tool for color validation and accessibility testing.
          </p>
        </div>
        <div
          id="upload"
          className="flex flex-col md:flex-row items-center justify-between shadow-sm shadow-zinc-700 p-6 rounded-lg bg-zinc-800"
        >
          <div className="w-full md:w-1/2 p-2 rounded-lg h-96 flex items-center justify-center">
            {firstImage ? (
              <img
                className="h-full w-full rounded-lg object-contain"
                src={firstImage}
                alt="Uploaded"
              />
            ) : (
              <img
                className="h-full w-full rounded-lg object-contain"
                src="https://via.placeholder.com/400x300?text=No+Image+Uploaded"
                alt="Placeholder"
              />
            )}
          </div>
          {firstImage && (
            <div className="w-full md:w-1/2 mx-4 p-4 text-center md:mt-0">
              <h2 className="mb-4 text-2xl font-mono text-zinc-100">
                Extracted Colors:
              </h2>
              
              {/* Color Blindness Simulation */}
              <div className="mb-6">
                <ColorBlindnessToggle
                  currentMode={colorBlindnessMode}
                  onModeChange={setColorBlindnessMode}
                  disabled={!colors.length}
                />
              </div>

              {/* Simulated Palette */}
              <SimulatedPalette
                colors={colors}
                mode={colorBlindnessMode}
                showOriginal={colorBlindnessMode !== 'normal'}
              />
            </div>
          )}
        </div>
        <div className="w-full rounded-md p-2 my-6 overflow-hidden bg-zinc-900">
          <h2 className="m-2 text-center text-zinc-300">
            Upload your Image here
          </h2>
          <div className="flex items-center justify-center">
            <input
              className="p-2 w-1/2 bg-zinc-200 shadow-2xl border-gray-900 rounded md:w-auto"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              className="px-4 mx-4 py-2 bg-violet-700 border-2 border-violet-700 drop-shadow-2xl text-sm text-zinc-50 rounded-md hover:bg-violet-800 md:w-auto"
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
        </div>
        {/* Extracted Text Section */}
        <div className="mt-8 p-2 bg-zinc-800 text-zinc-200 rounded-lg shadow-xl">
          <h2 className="text-2xl font-mono mb-4">Extracted Text</h2>
          {/* Loading Animation */}
          {textLoading ? (
            // <Loading />
            <p className="mt-4 text-yellow-300">
              Extracting text, please wait...
            </p>
          ) : extractedText ? (
            <div>
              <pre className="whitespace-pre-wrap bg-zinc-900 p-2 rounded-md text-zinc-200">
                {extractedText}
              </pre>
              {/* Copy Text Button */}
              <button
                className="mt-4 px-4 py-2 bg-violet-700 text-zinc-200 rounded-md hover:bg-violet-800"
                onClick={() => copyTextToClipboard(extractedText)}
              >
                Copy Text
              </button>
            </div>
          ) : (
            <p className="text-zinc-400">
              No text extracted yet. Upload an image to extract text.
            </p>
          )}
        </div>
        <h2 className="mt-6 text-3xl font-mono p-2 text-zinc-200 border-b border-dashed border-zinc-200 w-fit">
          Color Comparison:
        </h2>
        <p className="text-lg mt-2 p-4 rounded-lg text-zinc-300">
          The graphs show how closely the colors extracted from your uploaded
          image match predefined colors. Each bar represents a predefined color,
          and the percentage indicates the similarity. A higher percentage means
          the extracted color is very similar to the predefined color, while a
          lower percentage indicates less similarity.
        </p>
        <p className="mt-2 text-center p-4 bg-zinc-700 rounded-md text-zinc-200">
          The graph below shows the similarity percentage between the extracted
          color and predefined colors.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorComparison.map((comp, idx) => (
            <div key={idx} className="mt-4 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-mono mb-2 text-gray-700">
                Extracted Color: {comp.extractedColor}
              </h3>
              <div
                key={comp.extractedColor}
                style={{ backgroundColor: comp.extractedColor }}
                className="shadow-md color-box w-7 h-7 rounded-full flex items-center justify-center text-white"
              ></div>
              <Bar
                data={{
                  labels: comp.similarities.map((s) => s.color),
                  datasets: [
                    {
                      label: "Similarity %",
                      data: comp.similarities.map((s) => s.similarity),
                      backgroundColor: comp.similarities.map((s) => s.color),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          ))}
        </div>
        {suggestions.length > 0 && (
          <div className="mt-6 w-full p-2 bg-zinc-800 rounded-lg">
            <h2 className="text-lg text-zinc-300 font-semibold">
              Suggestions for Improvement:
            </h2>
            <ul className="mt-2  ">
              {suggestions.map((s, index) => (
                <li
                  key={index}
                  className="p-2 text-sm bg-zinc-700 text-white rounded-md mt-2 flex items-center"
                >
                  <div className="text-white text-center">
                    Use
                    <span
                      style={{ backgroundColor: s.suggestion }}
                      className="inline-block w-6 h-6 mx-4 rounded-full border border-white"
                    ></span>
                    <strong className="text-green-400">{s.suggestion}</strong>{" "}
                    instead of{" "}
                    <span
                      style={{ backgroundColor: s.color }}
                      className="inline-block  w-6 h-6 mx-2 rounded-full border border-white"
                    ></span>
                    <span className="text-red-400">{s.color}</span> for better
                    readability.
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        
        {/* Report Analysis Section */}
        <div className="mt-8 p-6 bg-zinc-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-zinc-100 mb-4 text-center">
            📊 Report Analysis
          </h2>
          <div className="flex justify-center">
            {isAnalyzing ? (
              <div className="flex items-center space-x-3 px-6 py-3 bg-zinc-700 rounded-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-violet-700"></div>
                <span className="text-zinc-300">Analyzing accessibility...</span>
              </div>
            ) : accessibilityReport ? (
              <button
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-zinc-100 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                onClick={handleShowReport}
              >
                📊 View Full Accessibility Report
              </button>
            ) : (
              <div className="text-zinc-500 px-6 py-3 bg-zinc-700 rounded-lg">
                📊 Complete image analysis to generate report
              </div>
            )}
          </div>
        </div>

        <h2 className="mt-6 text-3xl font-mono p-2 text-zinc-200 border-b border-dashed border-zinc-200 w-fit">
          Color Contrast:
        </h2>
        <p className="text-lg mt-2 p-4 rounded-lg text-zinc-200">
          The table below shows the contrast ratio between the extracted colors.
          A higher contrast ratio indicates better readability.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contrastResults.map((result, idx) => (
            <div key={idx} className="mt-4 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-mono mb-2 text-gray-700">
                Extracted Color: {result.extractedColor}
              </h3>
              <div
                key={result.extractedColor}
                style={{ backgroundColor: result.extractedColor }}
                className="shadow-md color-box w-7 h-7 rounded-full flex items-center justify-center text-white"
              ></div>
              <table className="w-full mt-2">
                <thead>
                  <tr>
                    <th className="text-left">Other Extracted Color</th>
                    <th className="text-left">Contrast Ratio</th>
                    <th className="text-left">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {result.contrasts?.map((contrast, idx) => (
                    <tr key={idx}>
                      <td
                        style={{ backgroundColor: contrast.color }}
                        className="p-2 text-white"
                      >
                        {contrast.color}
                      </td>
                      <td className="p-2">{contrast.contrast}</td>
                      <td className="p-2">{contrast.feedback}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <div className="p-2 my-4 bg-zinc-900 text-zinc-200">
          <h2 id="report" className="text-4xl font-bold text-zinc-200 mb-4">
            📊 Report Basis
          </h2>
          <p className="text-sm mb-4">
            The reports generated in this application are based on **color
            extraction, contrast ratio calculations, and WCAG accessibility
            guidelines**. This ensures that the extracted colors are tested for
            **readability, accessibility, and user-friendly contrast ratios**.
          </p>
          {/* Color Extraction */}
          <div className="mb-6">
            <h3 className="text-2xl text-violet-300 font-semibold mb-2">
              🎨 Color Extraction
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              The system extracts dominant colors from the uploaded image using
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
              how closely the colors match.
            </p>
          </div>
          {/* Contrast Ratio Calculation */}
          <div className="mb-6">
            <h3 className="text-2xl text-violet-300 font-semibold mb-2">
              📏 Contrast Ratio Calculation (WCAG Compliance)
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              The **contrast ratio** is calculated using **tinycolor.js**,
              following the **Web Content Accessibility Guidelines (WCAG 2.1)**
              to determine text readability.
            </p>
          </div>
          {/* Text Extraction */}
          <div className="mb-6">
            <h3 className="text-2xl text-violet-300 font-semibold mb-2">
              📝 Text Extraction
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              The system extracts text from the uploaded image using
              **Tesseract.js**. This text can be copied to the clipboard for
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
      
      {/* Accessibility Report Modal - Only show when button is clicked */}
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
