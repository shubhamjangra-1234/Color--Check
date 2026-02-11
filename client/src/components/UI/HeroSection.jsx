const HeroSection = () => {
  const scrollToUpload = () => {
    document
      .getElementById("upload")
      .scrollIntoView({ behavior: "smooth" });
  };

  const scrollToReport = () => {
    document
      .getElementById("report")
      .scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl md:text-7xl  my-2 md:my-6 text-center text-zinc-200">
        Welcome to Color Checker
      </h1>
      <h2 className="text-xl md:text-4xl mb-4 text-center text-zinc-200">
        Analyze and Compare Colors Effortlessly
      </h2>
      <p className="text-xs md:text-sm text-center mb-6 text-gray-400">
        Upload an image to analyze its colors, extract text inside the
        image and compare them with predefined colors.
      </p>
      <div className="flex justify-center space-x-4 md:mb-20 mb-4">
        <button
          className="px-6 py-2 bg-violet-700 border-2 border-violet-700 text-zinc-200 rounded-md drop-shadow-md hover:bg-violet-800 transition duration-300"
          onClick={scrollToUpload}
        >
          Upload
        </button>
        <button
          className="px-6 py-3 text-zinc-100"
          onClick={scrollToReport}
        >
          Learn More
        </button>
      </div>

      {/* Project Description */}
      <div className="mb-8 p-4 bg-zinc-800 text-zinc-300 rounded-lg shadow-xl">
        <p className="text-xs md:text-sm ">
          The **Color Checker** project is a tool that analyzes colors from
          uploaded images, compares them with predefined colors, and generates
          a percentage-based similarity chart. It also includes features like
            contrast ratio calculation for WCAG compliance, text readability
            analysis, and text extraction from images, making it a comprehensive
            tool for color validation and accessibility testing.
          </p>
        </div>
    </div>
  );
};

export default HeroSection;
