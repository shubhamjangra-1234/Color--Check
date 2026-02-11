const ContrastResultsDisplay = ({ contrastResults }) => {
  return (
    <>
      <h2 className="mt-6 text-3xl font-mono p-2 text-zinc-200 border-b border-dashed border-zinc-200 w-fit">
        Color Contrast:
      </h2>
      <p className="text-sm md:text-lg mt-2  -x-2 md:p-4 rounded-lg text-zinc-200">
        The table below shows contrast ratio between extracted colors.
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
                  <th className="text-left text-nowrap text-sm">Extracted Color</th>
                  <th className="text-left text-nowrap text-sm">Contrast Ratio</th>
                  <th className="text-left text-nowrap text-sm">Result</th>
                </tr>
              </thead>
              <tbody>
                {result.contrasts?.map((contrast, idx) => (
                  <tr key={idx}>
                    <td
                      style={{ backgroundColor: contrast.color }}
                      className="p-2 text-xs text-white"
                    >
                      {contrast.color}
                    </td>
                    <td className="p-2 text-xs">{contrast.contrast}</td>
                    <td className="p-2 text-nowrap text-xs">{contrast.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
};

export default ContrastResultsDisplay;
