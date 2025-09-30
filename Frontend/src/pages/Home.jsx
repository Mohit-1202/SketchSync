import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();
  const [canvasLink, setCanvasLink] = useState("");

  const handleNewCanvas = () => {
    const newSceneId = uuidv4();
    navigate(`/canvas/${newSceneId}`);
  };

  const handleOpenLink = () => {
    try {
      const url = new URL(canvasLink);
      const pathParts = url.pathname.split("/");
      const sceneId = pathParts[pathParts.length - 1];
      if (sceneId) navigate(`/canvas/${sceneId}`);
    } catch (err) {
      alert("Invalid URL. Please enter a valid canvas link.", err);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="w-full h-screen overflow-x-hidden bg-white text-gray-900 dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center space-y-10 px-4">
      {/* Logo & Title */}
      <div className="flex flex-col items-center space-y-3">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500 bg-clip-text text-transparent">
          SketchSync
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Your collaborative canvas editor
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col space-y-6 w-full max-w-md">
        <button
          onClick={handleNewCanvas}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl text-xl font-semibold shadow-lg transition-all transform hover:scale-105 text-white"
        >
          🎨 New Canvas
        </button>

        <div className="flex flex-col space-y-3">
          <input
            type="text"
            value={canvasLink}
            onChange={(e) => setCanvasLink(e.target.value)}
            placeholder="Paste existing canvas link here..."
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleOpenLink}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-lg font-semibold shadow-md transition-all transform hover:scale-105 text-white"
          >
            🔗 Open Canvas
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-gray-500 dark:text-gray-400 text-sm">
        Made with 💖 and 🎨 by SketchSync
      </div>
    </div>
    </>
  );
}

