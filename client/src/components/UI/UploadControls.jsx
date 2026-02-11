const UploadControls = ({ file, setFile, onUpload, isAnalyzing }) => {
  return (
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
          onClick={() => onUpload(file)}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default UploadControls;
