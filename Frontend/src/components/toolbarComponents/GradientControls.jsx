import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

const GradientControls = ({ canvas, isDarkTheme }) => {
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientType, setGradientType] = useState("linear");
  const [gradientColor1, setGradientColor1] = useState("#666666");
  const [gradientColor2, setGradientColor2] = useState("#999999");

  const gradientTypes = [
    { value: "linear", label: "Linear" },
    { value: "radial", label: "Radial" }
  ];

  useEffect(() => {
    if (!canvas) return;

    const updateFromObject = () => {
      const obj = canvas.getActiveObject();
      if (!obj || !obj.fill || !obj.fill.colorStops) {
        setGradientEnabled(false);
        return;
      }

      setGradientEnabled(true);
      setGradientType(obj.fill.type || "linear");
      setGradientColor1(obj.fill.colorStops[0]?.color || "#666666");
      setGradientColor2(obj.fill.colorStops[1]?.color || "#999999");
    };

    canvas.on("selection:created", updateFromObject);
    canvas.on("selection:updated", updateFromObject);

    return () => {
      canvas.off("selection:created", updateFromObject);
      canvas.off("selection:updated", updateFromObject);
    };
  }, [canvas]);

 
  const handleGradientToggle = (enabled) => {
    setGradientEnabled(enabled);
    
    const obj = canvas?.getActiveObject();
    if (!obj || obj.type === "line" || obj.type === "text") return;

    if (enabled) {
      applyGradient();
    } else {
      obj.set({ fill: "#666666" });
      canvas.renderAll();
    }
  };

  const applyGradient = () => {
    const obj = canvas?.getActiveObject();
    if (!obj || obj.type === "line" || obj.type === "text") return;

    let gradient;
    if (gradientType === "linear") {
      gradient = new fabric.Gradient({
        type: 'linear',
        gradientUnits: 'pixels',
        coords: { x1: 0, y1: 0, x2: obj.width, y2: 0 },
        colorStops: [
          { offset: 0, color: gradientColor1 },
          { offset: 1, color: gradientColor2 }
        ]
      });
    } else {
      gradient = new fabric.Gradient({
        type: 'radial',
        gradientUnits: 'pixels',
        coords: { 
          r1: Math.min(obj.width, obj.height) / 4,
          r2: Math.min(obj.width, obj.height) / 2,
          x1: obj.width / 2, y1: obj.height / 2,
          x2: obj.width / 2, y2: obj.height / 2
        },
        colorStops: [
          { offset: 0, color: gradientColor1 },
          { offset: 1, color: gradientColor2 }
        ]
      });
    }
    
    obj.set({ fill: gradient });
    canvas.renderAll();
  };

  const handleGradientTypeChange = (type) => {
    setGradientType(type);
    if (gradientEnabled) {
      applyGradient();
    }
  };

  const handleGradientColor1Change = (color) => {
    setGradientColor1(color);
    if (gradientEnabled) {
      applyGradient();
    }
  };

  const handleGradientColor2Change = (color) => {
    setGradientColor2(color);
    if (gradientEnabled) {
      applyGradient();
    }
  };

  const resetGradient = () => {
    setGradientType("linear");
    setGradientColor1("#666666");
    setGradientColor2("#999999");
    
    if (gradientEnabled) {
      applyGradient();
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
        <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
        Gradient Fill
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium ${textColor}`}>Gradient</label>
          <button
            onClick={() => handleGradientToggle(!gradientEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              gradientEnabled ? 'bg-pink-600' : isDarkTheme ? 'bg-gray-600' : 'bg-gray-400'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                gradientEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {gradientEnabled && (
          <>
            <div>
              <label className={`block text-xs font-medium mb-2 ${mutedText}`}>Gradient Type</label>
              <select 
                value={gradientType}
                onChange={(e) => handleGradientTypeChange(e.target.value)}
                className={`w-full p-2 border ${borderColor} rounded-lg ${inputBg} ${textColor} text-sm`}
              >
                {gradientTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-xs font-medium mb-1 ${mutedText}`}>Color 1</label>
                <input 
                  type="color" 
                  value={gradientColor1} 
                  onChange={(e) => handleGradientColor1Change(e.target.value)} 
                  className="w-full h-8 rounded cursor-pointer border border-gray-600"
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${mutedText}`}>Color 2</label>
                <input 
                  type="color" 
                  value={gradientColor2} 
                  onChange={(e) => handleGradientColor2Change(e.target.value)} 
                  className="w-full h-8 rounded cursor-pointer border border-gray-600"
                />
              </div>
            </div>

            <button
              onClick={resetGradient}
              className={`w-full ${isDarkTheme ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} text-white py-2 px-3 rounded text-sm font-medium transition-colors`}
            >
              Reset Gradient
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GradientControls;