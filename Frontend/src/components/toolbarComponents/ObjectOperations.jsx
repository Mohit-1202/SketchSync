// import { fabric } from 'fabric';

const ObjectOperations = ({ canvas, isDarkTheme }) => {
 
  const duplicateObject = () => {
    const obj = canvas?.getActiveObject();
    if (!obj) return;

    obj.clone((cloned) => {
      cloned.set({
        left: obj.left + 20,
        top: obj.top + 20
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };



  const deleteObject = () => {
    if (!canvas) return;
    const objs = canvas.getActiveObjects();
    objs.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const cardBg = isDarkTheme ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-300';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const hoverBg = isDarkTheme ? 'hover:bg-gray-750' : 'hover:bg-gray-200';

  return (
    <div className={`${cardBg} rounded-xl p-4 border ${borderColor}`}>
      <h3 className={`font-semibold mb-3 flex items-center ${textColor}`}>
        <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
        Object Operations
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={duplicateObject}
          className={`${cardBg} border ${borderColor} ${hoverBg} p-2 rounded-lg transition-all text-sm font-medium ${textColor} flex items-center justify-center space-x-1`}
        >
          <span>📋</span>
          <span>Duplicate</span>
        </button>
        <button 
          onClick={deleteObject}
          className={`${cardBg} border border-red-600 ${isDarkTheme ? 'hover:bg-red-900' : 'hover:bg-red-100'} p-2 rounded-lg transition-all text-sm font-medium text-red-400 flex items-center justify-center space-x-1`}
        >
          <span>🗑️</span>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ObjectOperations;