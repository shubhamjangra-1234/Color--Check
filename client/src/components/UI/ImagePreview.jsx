const ImagePreview = ({ firstImage }) => {
  return (
    <div
      id="upload"
      className="flex w-full flex-col md:flex-row items-center justify-between shadow-sm shadow-zinc-700 p-6 rounded-lg bg-zinc-800"
    >
      <div className="w-full p-2 rounded-lg h-96 flex items-center justify-center">
        {firstImage ? (
          <img
            className="h-full w-full rounded-lg object-contain"
            src={firstImage}
            alt="Uploaded"
          />
        ) : (
          <div className="h-full w-full rounded-lg bg-zinc-700 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📷</div>
              <div className="text-zinc-400">No image uploaded</div>
              <div className="text-zinc-500 text-sm">Upload an image to begin analysis</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
