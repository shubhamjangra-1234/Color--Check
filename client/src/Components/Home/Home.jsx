/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import ColorThief from "colorthief";
import tinycolor from "tinycolor2";
import { Bar } from "react-chartjs-2";
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
  const [file, setFile] = useState();
  const [firstImage, setFirstImage] = useState("");
  const [colors, setColors] = useState([]);
  const [colorComparison, setColorComparison] = useState([]);
  const [contrastResults, setContrastResults] = useState([]);
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

  useEffect(() => {
    axios
      .get("http://localhost:3000/getImage")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const lastImage = res.data[res.data.length - 1].image;
          setFirstImage(`http://localhost:3000/Images/${lastImage}`);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpload = () => {
    const formdata = new FormData();
    formdata.append("file", file);
    axios
      .post("http://localhost:3000/upload", formdata)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
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
        } catch (error) {
          console.error("Error extracting colors:", error);
        }
      };
    }
  }, [firstImage]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-gray-800">
      <main className="flex-grow p-4 w-full max-w-6xl">
        <h1 className="text-4xl mb-4 text-center text-blue-600">
          Welcome to Color Checker
        </h1>
        <p className="text-lg text-center mb-6 text-gray-400">
          Upload an image to analyze its colors and compare them with predefined
          colors.
        </p>
        <div
          id="upload"
          className="flex  flex-col md:flex-row items-center justify-between shadow-sm shadow-zinc-700 p-6 rounded-lg bg-gray-900"
        >
          <div className="w-full md:w-1/2 p-2 border border-zinc-400 rounded-lg h-96 flex items-center justify-center ">
            <img
              className="h-full w-full rounded object-contain"
              src={firstImage}
              alt="Uploaded"
            />
          </div>
          {firstImage && (
            <div className="w-full md:w-1/2 mx-4 p-4 text-center md:mt-0">
              <h2 className="mb-4 text-2xl font-mono text-zinc-100">
                Extracted Colors:
              </h2>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-3">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    style={{ backgroundColor: color }}
                    className="shadow-md color-box w-20 h-20 rounded-full flex items-center justify-center text-white"
                  >
                    {color}
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-2 my-2 border overflow-hidden border-zinc-400 bg-gray-50">
                <h2 className="font-mono m-2 text-zinc-800">
                  Upload your Image here
                </h2>
                <input
                  className="mb-4 p-2 bg-zinc-200 shadow-2xl border-gray-900 rounded  md:w-auto"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-700 w-full md:w-auto"
                  onClick={() => {
                    handleUpload();
                    window.location.reload();
                  }}
                >
                  Upload
                </button>
              </div>
            </div>
          )}
        </div>
        <h2 className="mt-6 text-3xl font-mono text-blue-600">
          Color Comparison:
        </h2>
        <p className="text-lg mt-2 p-4 rounded-lg text-zinc-200">
          The graphs show how closely the colors extracted from your uploaded
          image match predefined colors. Each bar represents a predefined color,
          and the percentage indicates the similarity. A higher percentage means
          the extracted color is very similar to the predefined color, while a
          lower percentage indicates less similarity.
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
        <h2 className="mt-6 text-3xl font-mono text-blue-600">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
