import React, { useState, useEffect } from 'react';

const TextTools = ({ canvas, isDarkTheme }) => {
  // Component manages its OWN state
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(24);
  
  const fontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Courier New", "Impact", "Comic Sans MS", "Trebuchet MS", "Arial Black"
  ];

  // Sync with selected text object
  useEffect(() => {
    if (!canvas) return;

    const updateFromObject = () => {
      const obj = canvas.getActiveObject();
      if (obj && (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text")) {
        setFontFamily(obj.fontFamily || "Arial");
        setFontSize(obj.fontSize || 24);
      }
    };

    canvas.on("selection:created", updateFromObject);
    canvas.on("selection:updated", updateFromObject);

    return () => {
      canvas.off("selection:created", updateFromObject);
      canvas.off("selection:updated", updateFromObject);
    };
  }, [canvas]);

 
  const handleFontFamilyChange = (family) => {
    setFontFamily(family);
    
    const obj = canvas?.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text")) {
      obj.set({ fontFamily: family });
      canvas.renderAll();
    }
  };

  const handleFontSizeChange = (size) => {
    const newSize = parseInt(size);
    setFontSize(newSize);
    
    const obj = canvas?.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text")) {
      obj.set({ fontSize: newSize });
      canvas.renderAll();
    }
  };

  const toggleBold = () => {
    const obj = canvas?.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text")) { 
      obj.set({ fontWeight: obj.fontWeight === "bold" ? "normal" : "bold" }); 
      canvas.renderAll(); 
    }
  };

  const toggleItalic = () => {
    const obj = canvas?.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text")) { 
      obj.set({ fontStyle: obj.fontStyle === "italic" ? "normal" : "italic" }); 
      canvas.renderAll(); 
    }
  };

  const toggleUnderline = () => {
    const obj = canvas?.getActiveObject();
    if (obj && (obj.type === "textbox" || obj.type === "i-text" || obj.type === "text")) { 
      obj.set({ underline: !obj.underline }); 
      canvas.renderAll(); 
    }
  };

  // Theme classes
  const cardBg = isDarkTheme ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-300';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkTheme ? 'bg-gray-800' : 'bg-white';
  const hoverBg = isDarkTheme ? 'hover:bg-gray-750' : 'hover:bg-gray-200';

  return (
    <div className={`${cardBg} rounded-xl p-4 border ${borderColor}`}>
      <h3 className={`font-semibold mb-3 flex items-center ${textColor}`}>
        <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
        Text Tools
      </h3>
      
      <div className="space-y-3">
        <div>
          <label className={`block text-sm font-medium mb-2 ${textColor}`}>Font Family</label>
          <select 
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className={`w-full p-2 border ${borderColor} rounded-lg ${inputBg} ${textColor} text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${textColor}`}>Font Size: {fontSize}px</label>
          <input 
            type="range" 
            value={fontSize} 
            min="8" 
            max="72" 
            onChange={(e) => handleFontSizeChange(e.target.value)} 
            className="w-full accent-orange-500"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={toggleBold}
            className={`${cardBg} border ${borderColor} ${hoverBg} p-2 rounded-lg transition-all font-bold ${textColor} text-sm`}
          >
            𝐁
          </button>
          <button 
            onClick={toggleItalic}
            className={`${cardBg} border ${borderColor} ${hoverBg} p-2 rounded-lg transition-all italic ${textColor} text-sm`}
          >
            𝐼
          </button>
          <button 
            onClick={toggleUnderline}
            className={`${cardBg} border ${borderColor} ${hoverBg} p-2 rounded-lg transition-all underline ${textColor} text-sm`}
          >
            𝐔
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextTools;