const ReportAnalysis = ({ isAnalyzing, accessibilityReport, onShowReport }) => {
  return (
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
            onClick={onShowReport}
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
  );
};

export default ReportAnalysis;
