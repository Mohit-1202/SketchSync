/* eslint-disable no-case-declarations */
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const ToolSelector = ({ canvas, isDarkTheme, activeTool, setActiveTool }) => {
  const tools = [
    { id: "select", icon: "👆", label: "Select" },
    { id: "rectangle", icon: "⬜", label: "Rect" },
    { id: "circle", icon: "⭕", label: "Circle" },
    { id: "triangle", icon: "🔺", label: "Triangle" },
    { id: "line", icon: "📏", label: "Line" },
    { id: "text", icon: "✏️", label: "Text" },
    { id: "pen", icon: "🖊️", label: "Pen" },
    { id: "eraser", icon: "🧽", label: "Eraser" }
  ];

  // Refs for drag-to-create functionality
  const isDrawingRef = useRef(false);
  const startPointRef = useRef(null);
  const currentShapeRef = useRef(null);

  // Apply tool settings whenever activeTool changes
  useEffect(() => {
    if (!canvas) return;
    applyToolSettings(activeTool);
    setupEventListeners();
  }, [activeTool, canvas, isDarkTheme]);

  const applyToolSettings = (toolName) => {
    if (!canvas) return;

    // Reset canvas state
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';
    canvas.skipTargetFind = false;

    // Exit text editing if currently editing
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.isEditing) {
      activeObject.exitEditing();
    }

    // Deselect all objects for drawing tools
    if (toolName !== "select") {
      canvas.discardActiveObject();
      canvas.renderAll();
    }

    switch (toolName) {
      case "select":
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
      case "pen":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 5;
        canvas.freeDrawingBrush.color = isDarkTheme ? "#ffffff" : "#000000";
        canvas.defaultCursor = 'crosshair';
        break;
      case "eraser":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 10;
        // For eraser, use background color to "erase"
        canvas.freeDrawingBrush.color = isDarkTheme ? "#0f172a" : "#ffffff";
        canvas.defaultCursor = 'crosshair';
        break;
      case "rectangle":
      case "circle":
      case "triangle":
      case "line":
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;
      case "text":
        canvas.selection = false;
        canvas.defaultCursor = 'text';
        break;
      default:
        break;
    }

    canvas.renderAll();
  };

  // Drag-to-create event handlers
  const handleMouseDown = (opt) => {
    // Don't start drawing if we're clicking on an existing object (unless it's select tool)
    if (opt.target && activeTool !== "select") return;
    
    // Only handle shape tools
    if (!["rectangle", "circle", "triangle", "line"].includes(activeTool)) return;

    const pointer = canvas.getPointer(opt.e);
    isDrawingRef.current = true;
    startPointRef.current = pointer;

    // Create the initial shape
    const baseStyles = {
      fill: 'transparent',
      stroke: isDarkTheme ? "#ffffff" : "#000000",
      strokeWidth: 2,
      selectable: false // Make it non-selectable while drawing
    };

    switch (activeTool) {
      case "rectangle":
        currentShapeRef.current = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          ...baseStyles
        });
        break;
      case "circle":
        currentShapeRef.current = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 0,
          ...baseStyles
        });
        break;
      case "triangle":
        currentShapeRef.current = new fabric.Triangle({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          ...baseStyles
        });
        break;
      case "line":
        currentShapeRef.current = new fabric.Line(
          [pointer.x, pointer.y, pointer.x, pointer.y],
          {
            stroke: isDarkTheme ? "#ffffff" : "#000000",
            strokeWidth: 2,
            selectable: false
          }
        );
        break;
      default:
        return;
    }

    if (currentShapeRef.current) {
      canvas.add(currentShapeRef.current);
    }
  };

  const handleMouseMove = (opt) => {
    if (!isDrawingRef.current || !currentShapeRef.current || !startPointRef.current) return;

    const pointer = canvas.getPointer(opt.e);
    const width = pointer.x - startPointRef.current.x;
    const height = pointer.y - startPointRef.current.y;

    switch (activeTool) {
      case "rectangle":
        currentShapeRef.current.set({
          width: Math.abs(width),
          height: Math.abs(height),
          left: width < 0 ? pointer.x : startPointRef.current.x,
          top: height < 0 ? pointer.y : startPointRef.current.y
        });
        break;
      case "circle":
        const radius = Math.sqrt(width * width + height * height) / 2;
        currentShapeRef.current.set({
          radius: radius,
          left: startPointRef.current.x + width / 2 - radius,
          top: startPointRef.current.y + height / 2 - radius
        });
        break;
      case "triangle":
        currentShapeRef.current.set({
          width: Math.abs(width),
          height: Math.abs(height),
          left: width < 0 ? pointer.x : startPointRef.current.x,
          top: height < 0 ? pointer.y : startPointRef.current.y
        });
        break;
      case "line":
        currentShapeRef.current.set({
          x2: pointer.x,
          y2: pointer.y
        });
        break;
    }

    canvas.renderAll();
  };

  const handleMouseUp = () => {
    if (!isDrawingRef.current || !currentShapeRef.current) return;
    
    // Remove very small shapes (accidental clicks)
    const isTooSmall = 
      (activeTool === "rectangle" && (currentShapeRef.current.width < 5 || currentShapeRef.current.height < 5)) ||
      (activeTool === "circle" && currentShapeRef.current.radius < 5) ||
      (activeTool === "triangle" && (currentShapeRef.current.width < 5 || currentShapeRef.current.height < 5)) ||
      (activeTool === "line" && 
        (Math.abs(currentShapeRef.current.x2 - currentShapeRef.current.x1) < 5 && 
         Math.abs(currentShapeRef.current.y2 - currentShapeRef.current.y1) < 5));

    if (isTooSmall) {
      canvas.remove(currentShapeRef.current);
    } else {
      // Make the shape selectable after creation
      currentShapeRef.current.set({ 
        selectable: true,
        evented: true
      });
      canvas.setActiveObject(currentShapeRef.current);
    }
    
    canvas.renderAll();
    
    // Reset states
    isDrawingRef.current = false;
    startPointRef.current = null;
    currentShapeRef.current = null;
  };

  // Text creation handler
  const handleTextCreation = (opt) => {
    if (opt.target) return;

    const pointer = canvas.getPointer(opt.e);
    
    const text = new fabric.IText("Click to type...", { 
      left: pointer.x, 
      top: pointer.y, 
      fill: isDarkTheme ? "#ffffff" : "#000000", 
      fontSize: 24, 
      fontFamily: "Arial",
      selectable: true
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    
    // Switch back to select tool after creating text
    setActiveTool("select");
    
    // Enter editing mode
    setTimeout(() => {
      text.enterEditing();
      text.hiddenTextarea.focus();
    }, 100);
  };

  // Setup event listeners based on active tool
  const setupEventListeners = () => {
    if (!canvas) return;

    // Remove all existing event listeners first
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    // Add event listeners for shape tools (drag-to-create)
    if (["rectangle", "circle", "triangle", "line"].includes(activeTool)) {
      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:move", handleMouseMove);
      canvas.on("mouse:up", handleMouseUp);
    }

    // Add event listener for text tool (single click)
    if (activeTool === "text") {
      canvas.on("mouse:down", handleTextCreation);
    }
  };

  const handleToolClick = (toolId) => {
    if (!canvas) {
      console.warn('Canvas not available');
      return;
    }

    // Toggle behavior for pen and eraser
    if ((toolId === "pen" && activeTool === "pen") || 
        (toolId === "eraser" && activeTool === "eraser")) {
      setActiveTool("select");
    } else {
      setActiveTool(toolId);
    }
  };

  // Theme classes
  const cardBg = isDarkTheme ? 'bg-gray-700' : 'bg-gray-100';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-300';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const mutedText = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const accentBorder = isDarkTheme ? 'border-purple-500' : 'border-purple-600';
  const accentBg = isDarkTheme ? 'bg-purple-900' : 'bg-purple-100';
  const hoverBg = isDarkTheme ? 'hover:bg-gray-750' : 'hover:bg-gray-200';

  return (
    <div className={`${cardBg} rounded-xl p-4 border ${borderColor}`}>
      <h3 className={`font-semibold mb-3 flex items-center ${textColor}`}>
        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
        Creative Tools
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {tools.map((tool) => (
          <button 
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={`p-2 rounded-lg transition-all duration-200 border-2 ${
              activeTool === tool.id 
                ? `${accentBorder} ${accentBg} ${mutedText} shadow-sm` 
                : `${borderColor} ${cardBg} ${mutedText} ${hoverBg}`
            }`}
            title={tool.label}
          >
            <div className="text-center">
              <div className="text-sm mb-1">{tool.icon}</div>
              <span className="text-xs font-medium ">{tool.label}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Instructions */}
      <div className={`mt-3 text-xs ${mutedText} text-center`}>
        {["rectangle", "circle", "triangle", "line"].includes(activeTool) && (
          <p>Click and drag to create {activeTool}</p>
        )}
        {activeTool === "text" && (
          <p>Click on canvas to add text</p>
        )}
        {activeTool === "pen" && (
          <p>Click and drag to draw freely</p>
        )}
        {activeTool === "eraser" && (
          <p>Click and drag to erase</p>
        )}
      </div>
    </div>
  );
};

export default ToolSelector;