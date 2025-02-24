export default function Navbar() {
    return (
      <div className="w-full py-4 px-6 bg-zinc-200 shadow-5xl flex justify-between items-center">
        {/* Left: Project Name */}
        <h1 className="text-2xl font-[arial] text-blue-800">Color Checker</h1>
  
        {/* Right: Get Started Button */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-800 transition">
          <a href="#upload" >Get Started</a>
        </button>
      </div>
    );
  }
  