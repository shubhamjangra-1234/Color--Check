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
          <img
            className="h-full w-full rounded-lg object-contain"
            src="https://via.placeholder.com/400x300?text=No+Image+Uploaded"
            alt="Placeholder"
          />
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
