/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import TemplateSelector from './toolbarComponents/TemplateSelector';
import ToolSelector from './toolbarComponents/ToolSelector';
import StyleControls from './toolbarComponents/StyleControls';
import TransformControls from './toolbarComponents/TransformControls';
import ShadowControls from './toolbarComponents/ShadowControls';
import GradientControls from './toolbarComponents/GradientControls';
import TextTools from './toolbarComponents/TextTools';
import ObjectOperations from './toolbarComponents/ObjectOperations';
import ArrangeTools from './toolbarComponents/ArrangeTools';
import ActionButtons from './toolbarComponents/ActionButtons';
import { Link } from "react-router-dom";

export default function Toolbar({ canvas }) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [activeTool, setActiveTool] = useState("select");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Update canvas background when theme changes
  useEffect(() => {
    if (!canvas) return;

    canvas.setBackgroundColor(isDarkTheme ? '#0f172a' : '#ffffff', () => {
      canvas.renderAll();
    });
  }, [isDarkTheme, canvas]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking on a tool (mobile)
  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Theme classes
  const bgColor = isDarkTheme ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-300';
  const mutedText = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const hoverBg = isDarkTheme ? 'hover:bg-gray-750' : 'hover:bg-gray-200';

  return (
    <>
      {/* Mobile Header Bar */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-40 ${bgColor} border-b ${borderColor} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg border ${borderColor} ${hoverBg} transition-all`}
            >
              {isSidebarOpen ? '✕' : '☰'}
            </button>
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            >
              SketchSync
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border ${borderColor} ${hoverBg} transition-all`}
              title={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <div className={`mt-2 text-xs ${mutedText} text-center`}>
          Active Tool: <span className="font-bold text-blue-400">{activeTool}</span>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static top-0 left-0 z-50 h-screen w-80 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${bgColor} ${textColor} p-6 flex flex-col space-y-6 overflow-y-auto shadow-xl border-r ${borderColor}
      `}>
        
        {/* Close button for mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-all"
        >
          ✕
        </button>

        {/* Header with Theme Toggle - Hidden on mobile since we have mobile header */}
        <div className="text-center mb-4 hidden md:block">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-3xl font-bold cursor-pointer">
                <Link
                  to="/"
                  className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
                >
                  SketchSync
                </Link>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border ${borderColor} ${hoverBg} transition-all`}
              title={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
          </div>
          <p className={`text-sm ${mutedText}`}>Create something amazing</p>
        </div>

        {/* All self-contained components */}
        <TemplateSelector canvas={canvas} isDarkTheme={isDarkTheme} />
        
        <ToolSelector 
          canvas={canvas} 
          isDarkTheme={isDarkTheme}
          activeTool={activeTool}
          setActiveTool={handleToolSelect}
        />
        
        <StyleControls canvas={canvas} activeTool={activeTool} isDarkTheme={isDarkTheme} />
        <TransformControls canvas={canvas} isDarkTheme={isDarkTheme} />
        <ShadowControls canvas={canvas} activeTool={activeTool} isDarkTheme={isDarkTheme} />
        
        {/* Conditional components */}
        {(activeTool === "rectangle" || activeTool === "circle" || activeTool === "triangle") && (
          <GradientControls canvas={canvas} activeTool={activeTool} isDarkTheme={isDarkTheme} />
        )}
        
        {activeTool === "text" && (
          <TextTools canvas={canvas} isDarkTheme={isDarkTheme} />
        )}

        <ObjectOperations canvas={canvas} isDarkTheme={isDarkTheme} />
        <ArrangeTools canvas={canvas} isDarkTheme={isDarkTheme} />
        <ActionButtons canvas={canvas} isDarkTheme={isDarkTheme} />

        {/* Footer */}
        <div className={`text-center pt-4 border-t ${borderColor}`}>
          <p className={`text-sm ${mutedText}`}>Made with 💖 and 🎨</p>
        </div>
      </div>

      <style jsx>{`
        .mobile-header-padding {
          padding-top: 80px;
        }
      `}</style>
    </>
  );
}