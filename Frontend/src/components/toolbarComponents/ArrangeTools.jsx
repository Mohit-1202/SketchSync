import React from 'react';

const ArrangeTools = ({ canvas, isDarkTheme }) => {
 
  const bringToFront = () => {
    const obj = canvas?.getActiveObject();
    if (obj) { 
      canvas.bringToFront(obj);
      canvas.renderAll(); 
    }
  };

  const sendToBack = () => {
    const obj = canvas?.getActiveObject();
    if (obj) { 
      canvas.sendToBack(obj);
      canvas.renderAll(); 
    }
  };

  // Theme classes
  const cardBg = isDarkTheme ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-300';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const hoverBg = isDarkTheme ? 'hover:bg-gray-750' : 'hover:bg-gray-200';

  return (
    <div className={`${cardBg} rounded-xl p-4 border ${borderColor}`}>
      <h3 className={`font-semibold mb-3 flex items-center ${textColor}`}>
        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
        Arrange
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={bringToFront} className={`${cardBg} border ${borderColor} ${hoverBg} p-2 rounded-lg transition-all text-sm font-medium ${textColor}`}>
          ↑ Front
        </button>
        <button onClick={sendToBack} className={`${cardBg} border ${borderColor} ${hoverBg} p-2 rounded-lg transition-all text-sm font-medium ${textColor}`}>
          ↓ Back
        </button>
      </div>
    </div>
  );
};

export default ArrangeTools;