import { useEffect, useState } from "react";
import axios from "axios";
import ColorThief from "colorthief";
import tinycolor from "tinycolor2";
import { Bar } from "react-chartjs-2";
import Tesseract from "tesseract.js";
import Loading from "../Loading/Loading";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
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
  const [loadingText, setLoadingText] = useState(false); // New state for loading
  const [suggestions, setSuggestions] = useState([]);

  const predefinedColors = [
    "#FF0000",
    "#003DA5",
    "#72B5E8",
    "#54585A",
    "#FFB612",
    "#158B45",
  ];

  const calculateSimilarity = (color1, color2) => {
    const c1 = tinycolor(color1).toRgb();
    const c2 = tinycolor(color2).toRgb();
    const distance = Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
    return Math.max(0, 100 - distance / 4.42);
  };

  const calculateContrast = (color1, color2) => {
    return tinycolor.readability(color1, color2).toFixed(2);
  };
  const suggestBetterColors = (extractedColors) => {
    const bgColor = extractedColors[0]; // Assume first color is the background
    const suggestions = extractedColors.map((color) => {
      const contrast = calculateContrast(color, bgColor);
      if (contrast < 3) {
        const betterColor = predefinedColors.find(
          (preColor) => calculateContrast(preColor, bgColor) >= 4.5
        );
        return {
          color,
          suggestion: betterColor || "Consider a higher contrast color",
        };
      }
      return { color, suggestion: "Good contrast" };
    });
    setSuggestions(suggestions);
  };
  const generateFeedback = (contrastRatio) => {
    if (contrastRatio >= 4.5) {
      return "Pass ✅";
    } else if (contrastRatio >= 3) {
      return "Pass ⚠️";
    } else {
      return "Fail ❌";
    }
  };
  useEffect(() => {
    if (colors.length > 0) {
      suggestBetterColors(colors);
    }
  }, [colors]);

  useEffect(() => {
    axios
      .get("https://color-check.onrender.com/getImage")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const lastImage = res.data[res.data.length - 1].image;
          setFirstImage(`https://color-check.onrender.com/${lastImage}`);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    setLoadingText(true); // Start loading animation
    setFirstImage(URL.createObjectURL(file));
    const formdata = new FormData();
    formdata.append("file", file);

    try {
      // Upload the image to the server
      const uploadResponse = await axios.post(
        "https://color-check.onrender.com/upload",
        formdata
      );

      // Extract text using Tesseract.js
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {});

      setExtractedText(text); // Set the extracted text to state

      // Update the UI without refreshing
      const lastImage = uploadResponse.data.image;
      setFirstImage(`https://color-check.onrender.com/Images/${lastImage}`);
    } catch (error) {
      console.error("Error during upload or text extraction:", error);
    } finally {
      setLoadingText(false); // Stop loading animation
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

  useEffect(() => {
    if (firstImage) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = firstImage;
      img.onload = () => {
        const colorThief = new ColorThief();
        try {
          const extractedColors = colorThief
            .getPalette(img, 6)
            .map((rgb) =>
              tinycolor({ r: rgb[0], g: rgb[1], b: rgb[2] }).toHexString()
            );
          setColors(extractedColors);

          const comparisonResults = extractedColors.map((color) => {
            return {
              extractedColor: color,
              similarities: predefinedColors.map((preColor) => {
                return {
                  color: preColor,
                  similarity: calculateSimilarity(color, preColor).toFixed(2),
                };
              }),
            };
          });

          setColorComparison(comparisonResults);

          const contrastResults = extractedColors.map((color, index) => {
            const contrasts = extractedColors
              .map((otherColor, otherIndex) => {
                if (index !== otherIndex) {
                  return {
                    color: otherColor,
                    contrast: calculateContrast(color, otherColor),
                    feedback: generateFeedback(
                      calculateContrast(color, otherColor)
                    ),
                  };
                }
                return null;
              })
              .filter(Boolean);

            return {
              extractedColor: color,
              contrasts,
            };
          });

          setContrastResults(contrastResults);

          // Add contrast feedback to colorComparison
          const updatedComparison = comparisonResults.map((comp, index) => {
            const feedback = contrastResults[index].contrasts.map(
              (c) => c.feedback
            );
            return {
              ...comp,
              feedback: feedback.includes("Fail ❌") ? "Fail ❌" : "Pass ✅",
            };
          });

          setColorComparison(updatedComparison);
          setReadabilityFeedback(contrastResults);
        } catch (error) {
          console.error("Error extracting colors:", error);
        }
      };
    }
  }, [firstImage]);

  // Function to download report as JSON
  const downloadJSON = () => {
    const reportData = {
      colors,
      colorComparison,
      contrastResults,
      readabilityFeedback,
      extractedText, // Include extracted text in the report
    };
    const json = JSON.stringify(reportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "color_checker_report.json";
    link.click();
    URL.revokeObjectURL(url);
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
              <div className="grid grid-cols-3 gap-2 md:grid-cols-3 lg:grid-cols-3">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: color }}
                    className="shadow-md color-box w-full h-24 rounded-sm flex items-center justify-center text-zinc-200"
                  >
                    {color}
                  </div>
                ))}
              </div>
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
          {loadingText ? (
            <Loading />
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

        {/* Download Buttons */}
        <div className="flex justify-center space-x-4 my-8">
          <button
            className="px-6 py-2 bg-violet-700 border-2 border-violet-700 text-zinc-200 rounded-md drop-shadow-md hover:bg-violet-800 transition duration-300"
            onClick={downloadJSON}
          >
            Download Report as JSON
          </button>
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
                  {result.contrasts.map((contrast, idx) => (
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
    </div>
  );
}

export default Home;
