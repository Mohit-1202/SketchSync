import React, { useState, useEffect } from 'react';

const StyleControls = ({ canvas, activeTool, isDarkTheme }) => {
  const [opacity, setOpacity] = useState(100);
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeEnabled, setStrokeEnabled] = useState(true);
  const [strokeColor, setStrokeColor] = useState(isDarkTheme ? "#ffffff" : "#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [borderRadius, setBorderRadius] = useState(0);

  const colorPalette = [
    "transparent", 
    isDarkTheme ? "#ffffff" : "#000000", 
    "#3B82F6", "#EF4444", "#10B981", 
    "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16", 
    "#F97316", "#6366F1", "#64748B", "#94A3B8", "#E2E8F0", 
    isDarkTheme ? "#000000" : "#ffffff"
  ];

  useEffect(() => {
    if (!canvas) return;

    const updateFromObject = () => {
      const obj = canvas.getActiveObject();
      if (!obj) return;

      setOpacity(Math.round((obj.opacity || 1) * 100));
      setFillColor((!obj.fill || obj.fill === '' || obj.fill === 'transparent') ? "transparent" : obj.fill);
      setStrokeEnabled(!!(obj.stroke && obj.strokeWidth > 0));
      setStrokeColor(obj.stroke || (isDarkTheme ? "#ffffff" : "#000000"));
      setStrokeWidth(obj.strokeWidth || 2);
      
      if (obj.type === "rect") {
        setBorderRadius(obj.rx || 0);
      }
    };

    canvas.on("selection:created", updateFromObject);
    canvas.on("selection:updated", updateFromObject);

    return () => {
      canvas.off("selection:created", updateFromObject);
      canvas.off("selection:updated", updateFromObject);
    };
  }, [canvas, isDarkTheme]);

 
  const handleOpacityChange = (value) => {
    const newOpacity = parseInt(value);
    setOpacity(newOpacity);
    
    const obj = canvas?.getActiveObject();
    if (obj) {
      obj.set({ opacity: newOpacity / 100 });
      canvas.renderAll();
    }
  };

  const handleFillColorChange = (color) => {
    setFillColor(color);
    
    const obj = canvas?.getActiveObject();
    if (obj && obj.type !== "line") {
      obj.set({ fill: color === "transparent" ? '' : color });
      canvas.renderAll();
    }
  };

  const handleStrokeToggle = (enabled) => {
    setStrokeEnabled(enabled);
    
    const obj = canvas?.getActiveObject();
    if (obj) {
      if (enabled) {
        obj.set({
          stroke: strokeColor,
          strokeWidth: strokeWidth
        });
      } else {
        obj.set({
          stroke: '',
          strokeWidth: 0
        });
      }
      canvas.renderAll();
    }
  };

  const handleStrokeColorChange = (color) => {
    setStrokeColor(color);
    
    const obj = canvas?.getActiveObject();
    if (obj && strokeEnabled) {
      obj.set({ stroke: color });
      canvas.renderAll();
    }
  };

  const handleStrokeWidthChange = (width) => {
    const newWidth = parseInt(width);
    setStrokeWidth(newWidth);
    
    const obj = canvas?.getActiveObject();
    if (obj && strokeEnabled) {
      obj.set({ strokeWidth: newWidth });
      canvas.renderAll();
    }
  };

  const handleBorderRadiusChange = (radius) => {
    const newRadius = parseInt(radius);
    setBorderRadius(newRadius);
    
    const obj = canvas?.getActiveObject();
    if (obj && obj.type === "rect") {
      obj.set({ rx: newRadius, ry: newRadius });
      canvas.renderAll();
    }
  };

  const cardBg = isDarkTheme ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-300';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const mutedText = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const inputBg = isDarkTheme ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`${cardBg} rounded-xl p-4 border ${borderColor}`}>
      <h3 className={`font-semibold mb-3 flex items-center ${textColor}`}>
        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
        Colors & Styles
      </h3>
      
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${textColor}`}>Opacity: {opacity}%</label>
        <input 
          type="range" 
          value={opacity} 
          min="10" 
          max="100" 
          onChange={(e) => handleOpacityChange(e.target.value)} 
          className="w-full accent-purple-500"
        />
      </div>

      {activeTool !== "line" && (
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${textColor}`}>
            Fill Color {fillColor === "transparent" && "(Transparent)"}
          </label>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input 
                type="color" 
                value={fillColor === "transparent" ? (isDarkTheme ? "#374151" : "#E5E7EB") : fillColor}
                onChange={(e) => handleFillColorChange(e.target.value)} 
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-600 shadow-sm"
              />
              {fillColor === "transparent" && (
                <div className="absolute inset-0 border-2 border-red-400 rounded-lg pointer-events-none" />
              )}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-5 gap-1">
                {colorPalette.map((color, index) => (
                  <button
                    key={index}
                    className={`w-6 h-6 rounded border border-gray-600 hover:scale-110 transition-transform shadow-sm ${
                      color === "transparent" ? "bg-gradient-to-br from-gray-500 to-gray-600" : ""
                    }`}
                    style={{ backgroundColor: color === "transparent" ? undefined : color }}
                    onClick={() => handleFillColorChange(color)}
                  >
                    {color === "transparent" && (
                      <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600 rounded" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className={`text-sm font-medium ${textColor}`}>
            {activeTool === "line" ? "Line" : "Border"}
          </label>
          <button
            onClick={() => handleStrokeToggle(!strokeEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              strokeEnabled ? 'bg-purple-600' : isDarkTheme ? 'bg-gray-600' : 'bg-gray-400'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                strokeEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {strokeEnabled && (
          <div className={`space-y-3 ${inputBg} p-3 rounded-lg border ${borderColor}`}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input 
                  type="color" 
                  value={strokeColor} 
                  onChange={(e) => handleStrokeColorChange(e.target.value)} 
                  className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                />
              </div>
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1 ${mutedText}`}>Width: {strokeWidth}px</label>
                <input 
                  type="range" 
                  value={strokeWidth} 
                  min="1" 
                  max="20" 
                  onChange={(e) => handleStrokeWidthChange(e.target.value)} 
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {activeTool === "rectangle" && (
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${textColor}`}>Border Radius: {borderRadius}px</label>
          <input 
            type="range" 
            value={borderRadius} 
            min="0" 
            max="50" 
            onChange={(e) => handleBorderRadiusChange(e.target.value)} 
            className="w-full accent-green-500"
          />
        </div>
      )}
    </div>
  );
};

export default StyleControls;