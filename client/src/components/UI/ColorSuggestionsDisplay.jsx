const ColorSuggestionsDisplay = ({ suggestions }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-6 w-full p-2 bg-zinc-800 rounded-lg">
      <h2 className="text-lg text-zinc-300 font-semibold">
        Suggestions for Improvement:
      </h2>
      <ul className="mt-2">
        {suggestions.map((s, index) => (
          <li
            key={index}
            className="p-2 text-sm bg-zinc-700 text-white rounded-md mt-2 flex items-center"
          >
            <div className="text-white ">
              Use
              <span
                style={{ backgroundColor: s.suggestion }}
                className="inline-block w-6 h-6 mx-4 rounded-full border border-white"
              ></span>
              <strong className="text-green-400">{s.suggestion}</strong>{" "}
              instead of{" "}
              <span
                style={{ backgroundColor: s.color }}
                className="inline-block w-6 h-6 mx-2 rounded-full border border-white"
              ></span>
              <span className="text-red-400">{s.color}</span> for better
              readability.
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColorSuggestionsDisplay;
