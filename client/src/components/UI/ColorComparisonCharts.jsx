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

const ColorComparisonCharts = ({ colorComparison }) => {
  return (
    <>
      <h2 className="mt-6 text-3xl font-mono p-2 text-zinc-200 border-b border-dashed border-zinc-200 w-fit">
        Color Comparison:
      </h2>
      <p className="text-sm md:text-lg mt-2 px-2 lg:p-4 rounded-lg text-zinc-300">
        The graphs show how closely colors extracted from your uploaded
        image match predefined colors. Each bar represents a predefined color,
        and percentage indicates similarity. A higher percentage means
        extracted color is very similar to predefined color, while a
        lower percentage indicates less similarity.
      </p>
      <p className="mt-2 text-center p-2 lg:p-4 bg-zinc-700 rounded-md text-zinc-200">
        The graph below shows similarity percentage between extracted
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
    </>
  );
};

export default ColorComparisonCharts;
