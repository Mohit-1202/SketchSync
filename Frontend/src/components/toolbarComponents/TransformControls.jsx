import React, { useState, useEffect } from 'react';

const TransformControls = ({ canvas, isDarkTheme }) => {
  // Component manages its OWN state
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);

  // Sync with selected object
  useEffect(() => {
    if (!canvas) return;

    const updateFromObject = () => {
      const obj = canvas.getActiveObject();
      if (!obj) return;

      setRotation(Math.round(obj.angle || 0));
      setFlipHorizontal(obj.flipX || false);
      setFlipVertical(obj.flipY || false);
    };

    const handleSelectionCleared = () => {
      // Reset or keep values? Let's keep them for UX
    };

    canvas.on("selection:created", updateFromObject);
    canvas.on("selection:updated", updateFromObject);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", updateFromObject);
      canvas.off("selection:updated", updateFromObject);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas]);

  // Component has its OWN handlers
  const handleRotationChange = (angle) => {
    const newRotation = parseInt(angle);
    setRotation(newRotation);
    
    const obj = canvas?.getActiveObject();
    if (obj) {
      obj.set('angle', newRotation);
      canvas.renderAll();
    }
  };

  const handleFlipHorizontal = () => {
    const newFlip = !flipHorizontal;
    setFlipHorizontal(newFlip);
    
    const obj = canvas?.getActiveObject();
    if (obj) {
      obj.set({ flipX: newFlip });
      canvas.renderAll();
    }
  };

  const handleFlipVertical = () => {
    const newFlip = !flipVertical;
    setFlipVertical(newFlip);
    
    const obj = canvas?.getActiveObject();
    if (obj) {
      obj.set({ flipY: newFlip });
      canvas.renderAll();
    }
  };

  // Theme classes (unchanged)
  const cardBg = isDarkTheme ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-300';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const accentBorder = isDarkTheme ? 'border-purple-500' : 'border-purple-600';
  const accentBg = isDarkTheme ? 'bg-purple-900' : 'bg-purple-100';

  return (
    <div className={`${cardBg} rounded-xl p-4 border ${borderColor}`}>
      <h3 className={`font-semibold mb-3 flex items-center ${textColor}`}>
        <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
        Transform
      </h3>
      
      <div className="space-y-3">
        {/* Rotation */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${textColor}`}>Rotation: {rotation}°</label>
          <input 
            type="range" 
            value={rotation} 
            min="0" 
            max="360" 
            onChange={(e) => handleRotationChange(e.target.value)} 
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Flip Controls */}
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleFlipHorizontal}
            className={`p-2 rounded-lg border-2 transition-all ${
              flipHorizontal ? `${accentBorder} ${accentBg} text-white` : `${borderColor} ${cardBg} ${textColor}`
            }`}
          >
            <div className="text-center">
              <div className="text-lg">↔️</div>
              <span className="text-xs">Flip H</span>
            </div>
          </button>
          <button 
            onClick={handleFlipVertical}
            className={`p-2 rounded-lg border-2 transition-all ${
              flipVertical ? `${accentBorder} ${accentBg} text-white` : `${borderColor} ${cardBg} ${textColor}`
            }`}
          >
            <div className="text-center">
              <div className="text-lg">↕️</div>
              <span className="text-xs">Flip V</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransformControls;