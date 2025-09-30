import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';

const ShadowControls = ({ canvas, isDarkTheme }) => {
  // Component manages its OWN state
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowBlur, setShadowBlur] = useState(10);
  const [shadowOffsetX, setShadowOffsetX] = useState(5);
  const [shadowOffsetY, setShadowOffsetY] = useState(5);

  // Sync with selected object
  useEffect(() => {
    if (!canvas) return;

    const updateFromObject = () => {
      const obj = canvas.getActiveObject();
      if (!obj) return;

      if (obj.shadow) {
        setShadowEnabled(true);
        setShadowColor(obj.shadow.color || "#000000");
        setShadowBlur(obj.shadow.blur || 10);
        setShadowOffsetX(obj.shadow.offsetX || 5);
        setShadowOffsetY(obj.shadow.offsetY || 5);
      } else {
        setShadowEnabled(false);
      }
    };

    canvas.on("selection:created", updateFromObject);
    canvas.on("selection:updated", updateFromObject);

    return () => {
      canvas.off("selection:created", updateFromObject);
      canvas.off("selection:updated", updateFromObject);
    };
  }, [canvas]);

  // Component has its OWN handlers
  const handleShadowToggle = (enabled) => {
    setShadowEnabled(enabled);
    
    const obj = canvas?.getActiveObject();
    if (obj) {
      if (enabled) {
        const shadow = new fabric.Shadow({
          color: shadowColor,
          blur: shadowBlur,
          offsetX: shadowOffsetX,
          offsetY: shadowOffsetY
        });
        obj.set({ shadow: shadow });
      } else {
        obj.set({ shadow: null });
      }
      canvas.renderAll();
    }
  };

  const handleShadowColorChange = (color) => {
    setShadowColor(color);
    
    const obj = canvas?.getActiveObject();
    if (obj && shadowEnabled) {
      const updatedShadow = new fabric.Shadow({
        color: color,
        blur: shadowBlur,
        offsetX: shadowOffsetX,
        offsetY: shadowOffsetY
      });
      obj.set({ shadow: updatedShadow });
      canvas.renderAll();
    }
  };

  const handleShadowBlurChange = (blur) => {
    const newBlur = parseInt(blur);
    setShadowBlur(newBlur);
    
    const obj = canvas?.getActiveObject();
    if (obj && shadowEnabled) {
      const updatedShadow = new fabric.Shadow({
        color: shadowColor,
        blur: newBlur,
        offsetX: shadowOffsetX,
        offsetY: shadowOffsetY
      });
      obj.set({ shadow: updatedShadow });
      canvas.renderAll();
    }
  };

  const handleShadowOffsetXChange = (offset) => {
    const newOffset = parseInt(offset);
    setShadowOffsetX(newOffset);
    
    const obj = canvas?.getActiveObject();
    if (obj && shadowEnabled) {
      const updatedShadow = new fabric.Shadow({
        color: shadowColor,
        blur: shadowBlur,
        offsetX: newOffset,
        offsetY: shadowOffsetY
      });
      obj.set({ shadow: updatedShadow });
      canvas.renderAll();
    }
  };

  const handleShadowOffsetYChange = (offset) => {
    const newOffset = parseInt(offset);
    setShadowOffsetY(newOffset);
    
    const obj = canvas?.getActiveObject();
    if (obj && shadowEnabled) {
      const updatedShadow = new fabric.Shadow({
        color: shadowColor,
        blur: shadowBlur,
        offsetX: shadowOffsetX,
        offsetY: newOffset
      });
      obj.set({ shadow: updatedShadow });
      canvas.renderAll();
    }
  };

  const resetShadow = () => {
    setShadowBlur(10);
    setShadowOffsetX(5);
    setShadowOffsetY(5);
    setShadowColor("#000000");
    
    const obj = canvas?.getActiveObject();
    if (obj && shadowEnabled) {
      const shadow = new fabric.Shadow({
        color: "#000000",
        blur: 10,
        offsetX: 5,
        offsetY: 5
      });
      obj.set({ shadow: shadow });
      canvas.renderAll();
    }
  };

  // Theme classes
  const cardBg = isDarkTheme ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-300';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const mutedText = isDarkTheme ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`${cardBg} rounded-xl p-4 border ${borderColor}`}>
      <h3 className={`font-semibold mb-3 flex items-center ${textColor}`}>
        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
        Shadow Effects
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium ${textColor}`}>Shadow</label>
          <button
            onClick={() => handleShadowToggle(!shadowEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              shadowEnabled ? 'bg-purple-600' : isDarkTheme ? 'bg-gray-600' : 'bg-gray-400'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                shadowEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {shadowEnabled && (
          <>
            <div>
              <label className={`block text-xs font-medium mb-2 ${mutedText}`}>Shadow Color</label>
              <input 
                type="color" 
                value={shadowColor} 
                onChange={(e) => handleShadowColorChange(e.target.value)} 
                className="w-full h-8 rounded cursor-pointer border border-gray-600"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-xs font-medium mb-1 ${mutedText}`}>Blur: {shadowBlur}px</label>
                <input 
                  type="range" 
                  value={shadowBlur} 
                  min="0" 
                  max="50" 
                  onChange={(e) => handleShadowBlurChange(e.target.value)} 
                  className="w-full accent-purple-500"
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${mutedText}`}>Offset X: {shadowOffsetX}px</label>
                <input 
                  type="range" 
                  value={shadowOffsetX} 
                  min="-50" 
                  max="50" 
                  onChange={(e) => handleShadowOffsetXChange(e.target.value)} 
                  className="w-full accent-purple-500"
                />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${mutedText}`}>Offset Y: {shadowOffsetY}px</label>
                <input 
                  type="range" 
                  value={shadowOffsetY} 
                  min="-50" 
                  max="50" 
                  onChange={(e) => handleShadowOffsetYChange(e.target.value)} 
                  className="w-full accent-purple-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetShadow}
                  className={`w-full ${isDarkTheme ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} text-white py-1 px-2 rounded text-xs font-medium transition-colors`}
                >
                  Reset
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShadowControls;