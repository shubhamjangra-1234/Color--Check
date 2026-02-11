import React from 'react';

const TextExtraction = ({ extractedText, onCopyText }) => {
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      alert("Text copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy text:", error);
      alert("Failed to copy text. Please try again.");
    }
  };

  return (
    <div className="mt-8 p-2 bg-zinc-800 text-zinc-200 rounded-lg shadow-xl">
      <h2 className="text-2xl font-mono mb-4 text-zinc-100">
        Extracted Text
      </h2>
      {extractedText ? (
        <div className="space-y-4">
          <div className="bg-zinc-700 p-4 rounded-md">
            <pre className="text-zinc-200 whitespace-pre-wrap font-mono text-sm">
              {extractedText}
            </pre>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-violet-700 text-zinc-200 rounded-md hover:bg-violet-800 transition-colors"
            onClick={handleCopyText}
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

export default TextExtraction;

// export const ColorComparison = ({ colorComparison }) => {

// };
