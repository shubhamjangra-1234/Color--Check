const TextExtractionDisplay = ({ extractedText, textLoading, onCopyText }) => {
  return (
    <div className="mt-8 p-2 bg-zinc-800 text-zinc-200 rounded-lg shadow-xl">
      <h2 className="text-2xl font-mono mb-4">Extracted Text</h2>
      {/* Loading Animation */}
      {textLoading ? (
        <p className="mt-4 text-yellow-300">
          Extracting text, please wait...
        </p>
      ) : extractedText ? (
        <div>
          <pre className="whitespace-pre-wrap text-sm bg-zinc-900 p-2 rounded-md text-zinc-200">
            {extractedText}
          </pre>
          {/* Copy Text Button */}
          <button
            className="mt-4 px-4 py-2 bg-violet-700 text-zinc-200 rounded-md hover:bg-violet-800"
            onClick={() => onCopyText(extractedText)}
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
  );
};

export default TextExtractionDisplay;
