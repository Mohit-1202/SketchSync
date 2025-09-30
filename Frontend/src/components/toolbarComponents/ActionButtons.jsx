import React from 'react';

const ActionButtons = ({ canvas, isDarkTheme }) => {
  // Component has its OWN handlers
  const shareCanvas = () => {
    navigator.clipboard.writeText(window.location.href);
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    notification.textContent = '🎉 Canvas link copied to clipboard!';
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const exportAsImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1
    });
    const link = document.createElement('a');
    link.download = 'amazing-design.png';
    link.href = dataURL;
    link.click();
  };

  const clearCanvas = () => {
    if (!canvas) return;
    if (window.confirm("Are you sure you want to clear this masterpiece? 🎨")) {
      canvas.clear();
      canvas.backgroundColor = isDarkTheme ? '#0f172a' : '#ffffff';
      canvas.renderAll();
    }
  };

  // Theme classes
  const cardBg = isDarkTheme ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-300';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';

  return (
    <div className={`${cardBg} rounded-xl p-4 border ${borderColor}`}>
      <h3 className={`font-semibold mb-3 flex items-center ${textColor}`}>
        <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
        Actions
      </h3>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={clearCanvas}
            className={`${cardBg} border border-orange-600 ${isDarkTheme ? 'hover:bg-orange-900' : 'hover:bg-orange-100'} p-2 rounded-lg transition-all font-medium text-sm text-orange-400 flex items-center justify-center space-x-1`}
          >
            <span>🧹</span>
            <span>Clear All</span>
          </button>
          
          <button 
            onClick={exportAsImage}
            className={`${cardBg} border border-green-600 ${isDarkTheme ? 'hover:bg-green-900' : 'hover:bg-green-100'} p-2 rounded-lg transition-all font-medium text-sm text-green-400 flex items-center justify-center space-x-1`}
          >
            <span>💾</span>
            <span>Export</span>
          </button>
        </div>
        
        <button 
          onClick={shareCanvas}
          className={`w-full ${cardBg} border border-purple-600 ${isDarkTheme ? 'hover:bg-purple-900' : 'hover:bg-purple-100'} p-3 rounded-lg transition-all font-medium text-purple-400 flex items-center justify-center space-x-2`}
        >
          <span>🚀</span>
          <span>Share Canvas</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;