export default function Navbar() {
    return (
      <div className="w-full py-4 px-6 bg-zinc-900 shadow-lg shadow-zinc-700 flex justify-between items-center">
      {/* Left: Project Name */}
      <h1 className="text-3xl font-[arial] text-purple-700">Color Checker</h1>
    
      {/* Right: Get Started Button */}
      <button className=" text-zinc-100 px-4 py-2 rounded-lg text-md hover:bg-purple-800 transition">
        <a href="#upload" >Get Started</a>
      </button>
      </div>
    );
  }
  