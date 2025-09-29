import { useState, useEffect } from "react";
import { fabric } from "fabric";

export default function Toolbar({ canvas }) {
  // Default styles for different object types - NO FILL by default
  const [rectangleStyles, setRectangleStyles] = useState({
    fillColor: "transparent",
    strokeEnabled: true,
    strokeColor: "#ffffff",
    strokeWidth: 2,
    borderRadius: 0,
    opacity: 100,
    shadowEnabled: false,
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    gradientEnabled: false,
    gradientType: "linear",
    gradientColor1: "#666666",
    gradientColor2: "#999999"
  });

  const [circleStyles, setCircleStyles] = useState({
    fillColor: "transparent",
    strokeEnabled: true,
    strokeColor: "#ffffff",
    strokeWidth: 2,
    opacity: 100,
    shadowEnabled: false,
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    gradientEnabled: false,
    gradientType: "linear",
    gradientColor1: "#666666",
    gradientColor2: "#999999"
  });

  const [textStyles, setTextStyles] = useState({
    fillColor: "#ffffff",
    strokeEnabled: false,
    strokeColor: "#ffffff",
    strokeWidth: 0,
    fontSize: 24,
    fontFamily: "Arial",
    opacity: 100,
    shadowEnabled: false,
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 5,
    shadowOffsetY: 5
  });

  const [activeTool, setActiveTool] = useState("select");
  const [currentTemplate, setCurrentTemplate] = useState("default");
  const [blurEnabled, setBlurEnabled] = useState(false);
  const [blurValue, setBlurValue] = useState(5);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);

  // Track if we're updating from object selection (to prevent feedback loop)
  const [isUpdatingFromObject, setIsUpdatingFromObject] = useState(false);

  // For drag-to-create functionality
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState(null);

  // Color palette with transparent first - updated for dark theme
  const colorPalette = [
    "transparent", "#ffffff", "#3B82F6", "#EF4444", "#10B981", 
    "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16", 
    "#F97316", "#6366F1", "#64748B", "#94A3B8", "#E2E8F0", "#000000"
  ];

  // Font families
  const fontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Courier New", "Impact", "Comic Sans MS", "Trebuchet MS", "Arial Black"
  ];

  // Gradient types
  const gradientTypes = [
    { value: "linear", label: "Linear" },
    { value: "radial", label: "Radial" }
  ];

  // Design templates - updated for dark theme
  const designTemplates = [
    { id: "default", name: "Default", color: "#3B82F6" },
    { id: "modern", name: "Modern", color: "#10B981" },
    { id: "elegant", name: "Elegant", color: "#8B5CF6" },
    { id: "vibrant", name: "Vibrant", color: "#EC4899" },
    { id: "minimal", name: "Minimal", color: "#64748B" }
  ];

  // Get current styles based on active tool
  const getCurrentStyles = () => {
    switch (activeTool) {
      case "rectangle": return rectangleStyles;
      case "circle": return circleStyles;
      case "text": return textStyles;
      default: return rectangleStyles;
    }
  };

  // Update specific style set
  const updateStyles = (updates, styleType) => {
    // Don't update if we're currently updating from object selection
    if (isUpdatingFromObject) return;

    switch (styleType) {
      case "rectangle":
        setRectangleStyles(prev => ({ ...prev, ...updates }));
        break;
      case "circle":
        setCircleStyles(prev => ({ ...prev, ...updates }));
        break;
      case "text":
        setTextStyles(prev => ({ ...prev, ...updates }));
        break;
      default:
        break;
    }
  };

  // Apply template styles
  const applyTemplate = (templateId) => {
    setCurrentTemplate(templateId);
    
    const templates = {
      modern: {
        fillColor: "#10B981",
        strokeEnabled: false,
        shadowEnabled: true,
        shadowBlur: 15,
        shadowOffsetX: 0,
        shadowOffsetY: 8
      },
      elegant: {
        fillColor: "#8B5CF6",
        strokeEnabled: true,
        strokeColor: "#6D28D9",
        strokeWidth: 3,
        shadowEnabled: true,
        shadowColor: "#6D28D9",
        shadowBlur: 20,
        shadowOffsetX: 5,
        shadowOffsetY: 5
      },
      vibrant: {
        fillColor: "#EC4899",
        strokeEnabled: false,
        gradientEnabled: true,
        gradientType: "linear",
        gradientColor1: "#EC4899",
        gradientColor2: "#8B5CF6"
      },
      minimal: {
        fillColor: "transparent",
        strokeEnabled: true,
        strokeColor: "#64748B",
        strokeWidth: 1,
        shadowEnabled: false
      },
      default: {
        fillColor: "transparent",
        strokeEnabled: true,
        strokeColor: "#ffffff",
        strokeWidth: 2,
        shadowEnabled: false,
        gradientEnabled: false
      }
    };

    const template = templates[templateId] || templates.default;
    updateStyles(template, activeTool);
  };

  // Live sync toolbar inputs with selected object
  useEffect(() => {
    if (!canvas) return;

    const updateToolbar = () => {
      const obj = canvas.getActiveObject();
      if (!obj) return;

      setIsUpdatingFromObject(true);

      // Get the actual object styles
      const baseStyles = {
        fillColor: obj.fill === 'transparent' || !obj.fill || obj.fill === '' ? "transparent" : obj.fill,
        strokeEnabled: !!obj.stroke && obj.strokeWidth > 0,
        strokeColor: obj.stroke || "#ffffff",
        strokeWidth: obj.strokeWidth || 2,
        opacity: Math.round((obj.opacity || 1) * 100)
      };

      // Handle shadow
      const shadowStyles = obj.shadow ? {
        shadowEnabled: true,
        shadowColor: obj.shadow.color || "#000000",
        shadowBlur: obj.shadow.blur || 10,
        shadowOffsetX: obj.shadow.offsetX || 5,
        shadowOffsetY: obj.shadow.offsetY || 5
      } : {
        shadowEnabled: false
      };

      // Handle gradient
      const gradientStyles = obj.fill && obj.fill.colorStops ? {
        gradientEnabled: true,
        gradientType: obj.fill.type || "linear",
        gradientColor1: obj.fill.colorStops[0]?.color || "#666666",
        gradientColor2: obj.fill.colorStops[1]?.color || "#999999"
      } : {
        gradientEnabled: false
      };

      // Handle blur - only for images
      if (obj.type === 'image' && obj.filters && obj.filters.length > 0) {
        const blurFilter = obj.filters.find(filter => filter.type === 'Blur');
        if (blurFilter) {
          setBlurEnabled(true);
          setBlurValue(blurFilter.blur);
        } else {
          setBlurEnabled(false);
        }
      } else {
        setBlurEnabled(false);
      }

      // Handle rotation
      setRotation(obj.angle || 0);

      // Handle flip
      setFlipHorizontal(obj.flipX || false);
      setFlipVertical(obj.flipY || false);

      // Update the appropriate style set based on object type
      if (obj.type === "textbox") {
        const textSpecificStyles = {
          fontSize: obj.fontSize || 24,
          fontFamily: obj.fontFamily || "Arial",
          ...baseStyles,
          ...shadowStyles
        };
        setTextStyles(prev => ({ ...prev, ...textSpecificStyles }));
      } else if (obj.type === "rect") {
        const rectSpecificStyles = {
          borderRadius: obj.rx || 0,
          ...baseStyles,
          ...shadowStyles,
          ...gradientStyles
        };
        setRectangleStyles(prev => ({ ...prev, ...rectSpecificStyles }));
      } else if (obj.type === "circle") {
        const circleSpecificStyles = {
          ...baseStyles,
          ...shadowStyles,
          ...gradientStyles
        };
        setCircleStyles(prev => ({ ...prev, ...circleSpecificStyles }));
      }

      // Reset the flag after a small delay to allow UI to update
      setTimeout(() => setIsUpdatingFromObject(false), 100);
    };

    const handleSelectionCleared = () => {
      // Reset toolbar when no object is selected
      setIsUpdatingFromObject(false);
    };

    canvas.on("selection:created", updateToolbar);
    canvas.on("selection:updated", updateToolbar);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", updateToolbar);
      canvas.off("selection:updated", updateToolbar);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas]);

  // Apply styles to selected object
  const applyStyles = (styles, objectType) => {
    const obj = canvas?.getActiveObject();
    if (!obj) return;

    // Apply opacity
    obj.set({ opacity: styles.opacity / 100 });

    // Apply shadow
    if (styles.shadowEnabled) {
      obj.set({
        shadow: new fabric.Shadow({
          color: styles.shadowColor,
          blur: styles.shadowBlur,
          offsetX: styles.shadowOffsetX,
          offsetY: styles.shadowOffsetY
        })
      });
    } else {
      obj.set({ shadow: null });
    }

    // Apply stroke
    if (styles.strokeEnabled) {
      obj.set({
        stroke: styles.strokeColor,
        strokeWidth: styles.strokeWidth
      });
    } else {
      obj.set({
        stroke: null,
        strokeWidth: 0
      });
    }

    // Apply fill or gradient
    if (styles.gradientEnabled && objectType !== "text") {
      let gradient;
      if (styles.gradientType === "linear") {
        gradient = new fabric.Gradient({
          type: 'linear',
          gradientUnits: 'pixels',
          coords: { x1: 0, y1: 0, x2: obj.width, y2: 0 },
          colorStops: [
            { offset: 0, color: styles.gradientColor1 },
            { offset: 1, color: styles.gradientColor2 }
          ]
        });
      } else {
        gradient = new fabric.Gradient({
          type: 'radial',
          gradientUnits: 'pixels',
          coords: { 
            r1: Math.min(obj.width, obj.height) / 4,
            r2: Math.min(obj.width, obj.height) / 2,
            x1: obj.width / 2,
            y1: obj.height / 2,
            x2: obj.width / 2,
            y2: obj.height / 2
          },
          colorStops: [
            { offset: 0, color: styles.gradientColor1 },
            { offset: 1, color: styles.gradientColor2 }
          ]
        });
      }
      obj.set({ fill: gradient });
    } else {
      // Handle transparent fill
      obj.set({ fill: styles.fillColor === "transparent" ? '' : styles.fillColor });
    }

    // Apply border radius to rectangles
    if (obj.type === "rect" && styles.borderRadius !== undefined) {
      obj.set({
        rx: styles.borderRadius,
        ry: styles.borderRadius
      });
    }

    // Apply text-specific properties
    if (obj.type === "textbox") {
      obj.set({ 
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily
      });
    }

    // Apply blur filter - only for images
    if (blurEnabled && obj.type === 'image') {
      obj.filters = obj.filters || [];
      const blurFilter = new fabric.Image.filters.Blur({ blur: blurValue });
      obj.filters = [blurFilter];
      obj.applyFilters();
    } else if (obj.type === 'image') {
      obj.filters = [];
      obj.applyFilters();
    }

    // Apply rotation
    obj.set({ angle: rotation });

    // Apply flip
    obj.set({
      flipX: flipHorizontal,
      flipY: flipVertical
    });

    canvas.renderAll();
  };

  // Real-time updates for selected object - FIXED: Only apply when not updating from object
  useEffect(() => {
    if (!canvas || isUpdatingFromObject) return;

    const obj = canvas.getActiveObject();
    if (!obj) return;

    let objectType;
    if (obj.type === "textbox") objectType = "text";
    else if (obj.type === "rect") objectType = "rectangle";
    else if (obj.type === "circle") objectType = "circle";
    else return;

    const styles = getCurrentStyles();
    applyStyles(styles, objectType);
  }, [
    rectangleStyles, circleStyles, textStyles, blurEnabled, blurValue, 
    rotation, flipHorizontal, flipVertical, canvas, isUpdatingFromObject
  ]);

  // Helper function to create gradient
  const createGradient = (styles) => {
    return new fabric.Gradient({
      type: styles.gradientType,
      gradientUnits: 'pixels',
      coords: styles.gradientType === 'linear' 
        ? { x1: 0, y1: 0, x2: 100, y2: 0 }
        : { 
            r1: 25, r2: 50,
            x1: 50, y1: 50,
            x2: 50, y2: 50
          },
      colorStops: [
        { offset: 0, color: styles.gradientColor1 },
        { offset: 1, color: styles.gradientColor2 }
      ]
    });
  };

  // Handle drag-to-create shapes
  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (opt) => {
      if (opt.target && opt.target !== canvas) return;
      if (!["rectangle", "circle"].includes(activeTool)) return;

      const pointer = canvas.getPointer(opt.e);
      setIsDrawingShape(true);
      setStartPoint({ x: pointer.x, y: pointer.y });

      const styles = getCurrentStyles();
      let shape;

      if (activeTool === "rectangle") {
        shape = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: styles.fillColor === "transparent" ? '' : 
                (styles.gradientEnabled ? createGradient(styles) : styles.fillColor),
          stroke: styles.strokeEnabled ? styles.strokeColor : null,
          strokeWidth: styles.strokeEnabled ? styles.strokeWidth : 0,
          rx: styles.borderRadius,
          ry: styles.borderRadius,
          opacity: styles.opacity / 100,
          selectable: false,
          shadow: styles.shadowEnabled ? new fabric.Shadow({
            color: styles.shadowColor,
            blur: styles.shadowBlur,
            offsetX: styles.shadowOffsetX,
            offsetY: styles.shadowOffsetY
          }) : null
        });
      } else if (activeTool === "circle") {
        shape = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 0,
          fill: styles.fillColor === "transparent" ? '' : 
                (styles.gradientEnabled ? createGradient(styles) : styles.fillColor),
          stroke: styles.strokeEnabled ? styles.strokeColor : null,
          strokeWidth: styles.strokeEnabled ? styles.strokeWidth : 0,
          opacity: styles.opacity / 100,
          selectable: false,
          shadow: styles.shadowEnabled ? new fabric.Shadow({
            color: styles.shadowColor,
            blur: styles.shadowBlur,
            offsetX: styles.shadowOffsetX,
            offsetY: styles.shadowOffsetY
          }) : null
        });
      }

      canvas.add(shape);
      setCurrentShape(shape);
    };

    const handleMouseMove = (opt) => {
      if (!isDrawingShape || !currentShape) return;

      const pointer = canvas.getPointer(opt.e);
      const width = pointer.x - startPoint.x;
      const height = pointer.y - startPoint.y;

      if (activeTool === "rectangle") {
        currentShape.set({
          width: Math.abs(width),
          height: Math.abs(height),
          left: width < 0 ? pointer.x : startPoint.x,
          top: height < 0 ? pointer.y : startPoint.y
        });
      } else if (activeTool === "circle") {
        const radius = Math.sqrt(width * width + height * height) / 2;
        currentShape.set({
          radius: radius,
          left: startPoint.x + width / 2 - radius,
          top: startPoint.y + height / 2 - radius
        });
      }

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawingShape || !currentShape) return;
      currentShape.set({ selectable: true });
      canvas.setActiveObject(currentShape);
      canvas.renderAll();
      setIsDrawingShape(false);
      setCurrentShape(null);
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [canvas, activeTool, isDrawingShape, startPoint, currentShape]);

  // Handle text creation (single click)
  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (opt) => {
      if (opt.target && opt.target !== canvas) return;
      if (activeTool !== "text") return;

      const pointer = canvas.getPointer(opt.e);
      const styles = getCurrentStyles();
      
      const text = new fabric.Textbox("Click to edit text", { 
        left: pointer.x, 
        top: pointer.y, 
        fill: styles.fillColor, 
        fontSize: styles.fontSize, 
        fontFamily: styles.fontFamily,
        fontWeight: "normal", 
        fontStyle: "normal", 
        stroke: styles.strokeEnabled ? styles.strokeColor : null, 
        strokeWidth: styles.strokeEnabled ? styles.strokeWidth : 0,
        opacity: styles.opacity / 100,
        selectable: true,
        width: 200,
        editable: true,
        shadow: styles.shadowEnabled ? new fabric.Shadow({
          color: styles.shadowColor,
          blur: styles.shadowBlur,
          offsetX: styles.shadowOffsetX,
          offsetY: styles.shadowOffsetY
        }) : null
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
      selectTool("select");
    };

    canvas.on("mouse:down", handleMouseDown);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
    };
  }, [canvas, activeTool]);

  // Tool selection functions
  const selectTool = (toolName) => {
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';

    setActiveTool(toolName);

    switch (toolName) {
      case "select":
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
      case "pen":
        canvas.isDrawingMode = true;
        const styles = getCurrentStyles();
        canvas.freeDrawingBrush.width = styles.strokeWidth;
        canvas.freeDrawingBrush.color = styles.fillColor === "transparent" ? "#ffffff" : styles.fillColor;
        break;
      case "eraser":
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 10;
        canvas.freeDrawingBrush.color = "#00aaff";
        break;
      case "rectangle":
      case "circle":
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
  };

  // Reset functions for each style type
  const resetShadow = (styleType) => {
    const reset = {
      shadowBlur: 10,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
      shadowColor: "#000000"
    };
    updateStyles(reset, styleType);
  };

  const resetGradient = (styleType) => {
    const reset = {
      gradientColor1: "#666666",
      gradientColor2: "#999999",
      gradientType: "linear"
    };
    updateStyles(reset, styleType);
  };

  // Event handlers
  const handleFillColorChange = (color) => {
    updateStyles({ fillColor: color }, activeTool);
  };

  const handleStrokeToggle = (enabled) => {
    updateStyles({ strokeEnabled: enabled }, activeTool);
  };

  const handleStrokeColorChange = (color) => {
    updateStyles({ strokeColor: color }, activeTool);
  };

  const handleStrokeWidthChange = (width) => {
    updateStyles({ strokeWidth: width }, activeTool);
  };

  const handleOpacityChange = (opacity) => {
    updateStyles({ opacity }, activeTool);
  };

  const handleBorderRadiusChange = (radius) => {
    updateStyles({ borderRadius: radius }, "rectangle");
  };

  const handleFontSizeChange = (size) => {
    updateStyles({ fontSize: size }, "text");
  };

  const handleFontFamilyChange = (family) => {
    updateStyles({ fontFamily: family }, "text");
  };

  const handleShadowToggle = (enabled) => {
    updateStyles({ shadowEnabled: enabled }, activeTool);
  };

  const handleShadowColorChange = (color) => {
    updateStyles({ shadowColor: color }, activeTool);
  };

  const handleShadowBlurChange = (blur) => {
    updateStyles({ shadowBlur: blur }, activeTool);
  };

  const handleShadowOffsetXChange = (offset) => {
    updateStyles({ shadowOffsetX: offset }, activeTool);
  };

  const handleShadowOffsetYChange = (offset) => {
    updateStyles({ shadowOffsetY: offset }, activeTool);
  };

  const handleGradientToggle = (enabled) => {
    updateStyles({ gradientEnabled: enabled }, activeTool);
  };

  const handleGradientTypeChange = (type) => {
    updateStyles({ gradientType: type }, activeTool);
  };

  const handleGradientColor1Change = (color) => {
    updateStyles({ gradientColor1: color }, activeTool);
  };

  const handleGradientColor2Change = (color) => {
    updateStyles({ gradientColor2: color }, activeTool);
  };

  const handleRotationChange = (angle) => {
    setRotation(angle);
  };

  const handleFlipHorizontal = () => {
    setFlipHorizontal(!flipHorizontal);
  };

  const handleFlipVertical = () => {
    setFlipVertical(!flipVertical);
  };

  const handleBlurToggle = (enabled) => {
    setBlurEnabled(enabled);
    if (!enabled) {
      setBlurValue(5);
    }
  };

  const handleBlurChange = (blur) => {
    setBlurValue(blur);
  };

  // Get current values for UI
  const currentStyles = getCurrentStyles();

  // Duplicate selected object
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

  // Group selected objects
  const groupObjects = () => {
    const objects = canvas?.getActiveObjects();
    if (!objects || objects.length < 2) return;

    const group = new fabric.Group(objects);
    canvas.discardActiveObject();
    canvas.setActiveObject(group);
    canvas.renderAll();
  };

  // Ungroup selected group
  const ungroupObjects = () => {
    const obj = canvas?.getActiveObject();
    if (!obj || obj.type !== 'group') return;

    const objects = obj.getObjects();
    obj.toActiveSelection();
    canvas.discardActiveObject();
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };

  // DELETE FUNCTION
  const deleteObject = () => {
    if (!canvas) return;
    const objs = canvas.getActiveObjects();
    objs.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  // PEN / ERASER FUNCTIONS
  const toggleDrawing = () => {
    if (activeTool === "pen") {
      selectTool("select");
    } else {
      selectTool("pen");
    }
  };

  const toggleEraser = () => {
    if (activeTool === "eraser") {
      selectTool("select");
    } else {
      selectTool("eraser");
    }
  };

  // TEXT STYLING FUNCTIONS
  const toggleBold = () => {
    const obj = canvas?.getActiveObject();
    if (obj?.type === "textbox") { 
      obj.set({ fontWeight: obj.fontWeight === "bold" ? "normal" : "bold" }); 
      canvas.renderAll(); 
    }
  };

  const toggleItalic = () => {
    const obj = canvas?.getActiveObject();
    if (obj?.type === "textbox") { 
      obj.set({ fontStyle: obj.fontStyle === "italic" ? "normal" : "italic" }); 
      canvas.renderAll(); 
    }
  };

  const toggleUnderline = () => {
    const obj = canvas?.getActiveObject();
    if (obj?.type === "textbox") { 
      obj.set({ underline: !obj.underline }); 
      canvas.renderAll(); 
    }
  };

  // ARRANGE FUNCTIONS
  const bringForward = () => {
    const obj = canvas?.getActiveObject();
    if (obj) { 
      canvas.bringForward(obj);
      canvas.renderAll(); 
    }
  };

  const sendBackward = () => {
    const obj = canvas?.getActiveObject();
    if (obj) { 
      canvas.sendBackwards(obj);
      canvas.renderAll(); 
    }
  };

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

  // SHARE LINK FUNCTION
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

  // EXPORT AS IMAGE FUNCTION
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

  // CLEAR CANVAS FUNCTION
  const clearCanvas = () => {
    if (!canvas) return;
    if (window.confirm("Are you sure you want to clear this masterpiece? 🎨")) {
      canvas.clear();
      canvas.backgroundColor = '#00aaff';
      canvas.renderAll();
    }
  };

  return (
    <div className="w-80 bg-gray-800 text-white p-6 flex flex-col space-y-6 h-screen overflow-y-auto shadow-xl border-r border-gray-700">
      
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-lg text-white">🎨</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            SketchSync
          </h1>
        </div>
        <p className="text-gray-300 text-sm">Create something amazing</p>
      </div>

      {/* Quick Templates */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <h3 className="font-semibold mb-3 text-white flex items-center">
          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
          Quick Templates
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {designTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => applyTemplate(template.id)}
              className={`p-2 rounded-lg border-2 transition-all ${
                currentTemplate === template.id
                  ? "border-purple-500 bg-purple-900"
                  : "border-gray-600 bg-gray-800 hover:border-gray-500"
              }`}
            >
              <div 
                className="w-full h-8 rounded mb-1 border border-gray-600"
                style={{ backgroundColor: template.color }}
              />
              <span className="text-xs text-gray-200">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tools Section */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <h3 className="font-semibold mb-3 text-white flex items-center">
          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
          Creative Tools
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "select", icon: "👆", label: "Select" },
            { id: "rectangle", icon: "⬜", label: "Rectangle" },
            { id: "circle", icon: "⭕", label: "Circle" },
            { id: "text", icon: "✏️", label: "Text" },
            { id: "pen", icon: "🖊️", label: "Pen" },
            { id: "eraser", icon: "🧽", label: "Eraser" }
          ].map((tool) => (
            <button 
              key={tool.id}
              onClick={() => tool.id === "pen" ? toggleDrawing() : tool.id === "eraser" ? toggleEraser() : selectTool(tool.id)}
              className={`p-3 rounded-lg transition-all duration-200 border-2 ${
                activeTool === tool.id 
                  ? "border-purple-500 bg-purple-900 text-white shadow-sm" 
                  : "border-gray-600 bg-gray-800 text-gray-200 hover:border-gray-500 hover:bg-gray-750"
              }`}
              title={tool.label}
            >
              <div className="text-center">
                <div className="text-base mb-1">{tool.icon}</div>
                <span className="text-xs font-medium">{tool.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Colors Section */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <h3 className="font-semibold mb-3 text-white flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          Colors & Styles
        </h3>
        
        {/* Opacity */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-200">Opacity: {currentStyles.opacity}%</label>
          <input 
            type="range" 
            value={currentStyles.opacity} 
            min="10" 
            max="100" 
            onChange={(e) => handleOpacityChange(Number(e.target.value))} 
            className="w-full accent-purple-500"
          />
        </div>

        {/* Fill Color */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-200">
            Fill Color {currentStyles.fillColor === "transparent" && "(Transparent)"}
          </label>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input 
                type="color" 
                value={currentStyles.fillColor === "transparent" ? "#374151" : currentStyles.fillColor}
                onChange={(e) => handleFillColorChange(e.target.value)} 
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-600 shadow-sm"
              />
              {currentStyles.fillColor === "transparent" && (
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

        {/* Stroke Toggle and Settings */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-200">Border</label>
            <button
              onClick={() => handleStrokeToggle(!currentStyles.strokeEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                currentStyles.strokeEnabled ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  currentStyles.strokeEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {currentStyles.strokeEnabled && (
            <div className="space-y-3 bg-gray-800 p-3 rounded-lg border border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input 
                    type="color" 
                    value={currentStyles.strokeColor} 
                    onChange={(e) => handleStrokeColorChange(e.target.value)} 
                    className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-gray-400">Width: {currentStyles.strokeWidth}px</label>
                  <input 
                    type="range" 
                    value={currentStyles.strokeWidth} 
                    min="1" 
                    max="20" 
                    onChange={(e) => handleStrokeWidthChange(Number(e.target.value))} 
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Border Radius - Only show for rectangle tool */}
        {activeTool === "rectangle" && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-200">Border Radius: {currentStyles.borderRadius}px</label>
            <input 
              type="range" 
              value={currentStyles.borderRadius} 
              min="0" 
              max="50" 
              onChange={(e) => handleBorderRadiusChange(Number(e.target.value))} 
              className="w-full accent-green-500"
            />
          </div>
        )}
      </div>

      {/* Transform Tools */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <h3 className="font-semibold mb-3 text-white flex items-center">
          <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
          Transform
        </h3>
        
        <div className="space-y-3">
          {/* Rotation */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Rotation: {rotation}°</label>
            <input 
              type="range" 
              value={rotation} 
              min="0" 
              max="360" 
              onChange={(e) => handleRotationChange(Number(e.target.value))} 
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Flip Controls */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleFlipHorizontal}
              className={`p-2 rounded-lg border-2 transition-all ${
                flipHorizontal ? "border-indigo-500 bg-indigo-900 text-white" : "border-gray-600 bg-gray-800 text-gray-200"
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
                flipVertical ? "border-indigo-500 bg-indigo-900 text-white" : "border-gray-600 bg-gray-800 text-gray-200"
              }`}
            >
              <div className="text-center">
                <div className="text-lg">↕️</div>
                <span className="text-xs">Flip V</span>
              </div>
            </button>
          </div>

          {/* Blur Effect - Only show for images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-200">Blur Effect</label>
              <button
                onClick={() => handleBlurToggle(!blurEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  blurEnabled ? 'bg-indigo-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    blurEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {blurEnabled && (
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-400">Blur Amount: {blurValue}px</label>
                <input 
                  type="range" 
                  value={blurValue} 
                  min="1" 
                  max="20" 
                  onChange={(e) => handleBlurChange(Number(e.target.value))} 
                  className="w-full accent-indigo-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shadow Effects */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <h3 className="font-semibold mb-3 text-white flex items-center">
          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
          Shadow Effects
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-200">Shadow</label>
            <button
              onClick={() => handleShadowToggle(!currentStyles.shadowEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                currentStyles.shadowEnabled ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  currentStyles.shadowEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {currentStyles.shadowEnabled && (
            <>
              <div>
                <label className="block text-xs font-medium mb-2 text-gray-400">Shadow Color</label>
                <input 
                  type="color" 
                  value={currentStyles.shadowColor} 
                  onChange={(e) => handleShadowColorChange(e.target.value)} 
                  className="w-full h-8 rounded cursor-pointer border border-gray-600"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-400">Blur: {currentStyles.shadowBlur}px</label>
                  <input 
                    type="range" 
                    value={currentStyles.shadowBlur} 
                    min="0" 
                    max="50" 
                    onChange={(e) => handleShadowBlurChange(Number(e.target.value))} 
                    className="w-full accent-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-400">Offset X: {currentStyles.shadowOffsetX}px</label>
                  <input 
                    type="range" 
                    value={currentStyles.shadowOffsetX} 
                    min="-50" 
                    max="50" 
                    onChange={(e) => handleShadowOffsetXChange(Number(e.target.value))} 
                    className="w-full accent-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-400">Offset Y: {currentStyles.shadowOffsetY}px</label>
                  <input 
                    type="range" 
                    value={currentStyles.shadowOffsetY} 
                    min="-50" 
                    max="50" 
                    onChange={(e) => handleShadowOffsetYChange(Number(e.target.value))} 
                    className="w-full accent-purple-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => resetShadow(activeTool)}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white py-1 px-2 rounded text-xs font-medium transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gradient Effects - Only show for shape tools */}
      {(activeTool === "rectangle" || activeTool === "circle") && (
        <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
          <h3 className="font-semibold mb-3 text-white flex items-center">
            <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
            Gradient Fill
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-200">Gradient</label>
              <button
                onClick={() => handleGradientToggle(!currentStyles.gradientEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  currentStyles.gradientEnabled ? 'bg-pink-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentStyles.gradientEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {currentStyles.gradientEnabled && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-2 text-gray-400">Gradient Type</label>
                  <select 
                    value={currentStyles.gradientType}
                    onChange={(e) => handleGradientTypeChange(e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm"
                  >
                    {gradientTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">Color 1</label>
                    <input 
                      type="color" 
                      value={currentStyles.gradientColor1} 
                      onChange={(e) => handleGradientColor1Change(e.target.value)} 
                      className="w-full h-8 rounded cursor-pointer border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-400">Color 2</label>
                    <input 
                      type="color" 
                      value={currentStyles.gradientColor2} 
                      onChange={(e) => handleGradientColor2Change(e.target.value)} 
                      className="w-full h-8 rounded cursor-pointer border border-gray-600"
                    />
                  </div>
                </div>

                <button
                  onClick={() => resetGradient(activeTool)}
                  className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                >
                  Reset Gradient
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Text Tools - Only show for text tool */}
      {activeTool === "text" && (
        <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
          <h3 className="font-semibold mb-3 text-white flex items-center">
            <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
            Text Tools
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Font Family</label>
              <select 
                value={currentStyles.fontFamily}
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {fontFamilies.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">Font Size: {currentStyles.fontSize}px</label>
              <input 
                type="range" 
                value={currentStyles.fontSize} 
                min="8" 
                max="72" 
                onChange={(e) => handleFontSizeChange(Number(e.target.value))} 
                className="w-full accent-orange-500"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={toggleBold}
                className="bg-gray-800 border border-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-all font-bold text-white text-sm"
              >
                𝐁
              </button>
              <button 
                onClick={toggleItalic}
                className="bg-gray-800 border border-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-all italic text-white text-sm"
              >
                𝐼
              </button>
              <button 
                onClick={toggleUnderline}
                className="bg-gray-800 border border-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-all underline text-white text-sm"
              >
                𝐔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Object Operations */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <h3 className="font-semibold mb-3 text-white flex items-center">
          <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
          Object Operations
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={duplicateObject}
            className="bg-gray-800 border border-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-all text-sm font-medium text-white flex items-center justify-center space-x-1"
          >
            <span>📋</span>
            <span>Duplicate</span>
          </button>
          <button 
            onClick={groupObjects}
            className="bg-gray-800 border border-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-all text-sm font-medium text-white flex items-center justify-center space-x-1"
          >
            <span>👥</span>
            <span>Group</span>
          </button>
          <button 
            onClick={ungroupObjects}
            className="bg-gray-800 border border-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-all text-sm font-medium text-white flex items-center justify-center space-x-1"
          >
            <span>👤</span>
            <span>Ungroup</span>
          </button>
          <button 
            onClick={deleteObject}
            className="bg-gray-800 border border-red-600 hover:bg-red-900 p-2 rounded-lg transition-all text-sm font-medium text-red-400 flex items-center justify-center space-x-1"
          >
            <span>🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Arrange Tools */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <h3 className="font-semibold mb-3 text-white flex items-center">
          <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
          Arrange
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={bringToFront} className="bg-gray-800 border border-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-all text-sm font-medium text-white">
            ↑ Front
          </button>
          <button onClick={bringForward} className="bg-gray-800 border border-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-all text-sm font-medium text-white">
            ↑ Forward
          </button>
          <button onClick={sendBackward} className="bg-gray-800 border border-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-all text-sm font-medium text-white">
            ↓ Backward
          </button>
          <button onClick={sendToBack} className="bg-gray-800 border border-gray-600 hover:bg-gray-700 p-2 rounded-lg transition-all text-sm font-medium text-white">
            ↓ Back
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
        <h3 className="font-semibold mb-3 text-white flex items-center">
          <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
          Actions
        </h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={clearCanvas}
              className="bg-gray-800 border border-orange-600 hover:bg-orange-900 p-2 rounded-lg transition-all font-medium text-sm text-orange-400 flex items-center justify-center space-x-1"
            >
              <span>🧹</span>
              <span>Clear All</span>
            </button>
            
            <button 
              onClick={exportAsImage}
              className="bg-gray-800 border border-green-600 hover:bg-green-900 p-2 rounded-lg transition-all font-medium text-sm text-green-400 flex items-center justify-center space-x-1"
            >
              <span>💾</span>
              <span>Export</span>
            </button>
          </div>
          
          <button 
            onClick={shareCanvas}
            className="w-full bg-gray-800 border border-purple-600 hover:bg-purple-900 p-3 rounded-lg transition-all font-medium text-purple-400 flex items-center justify-center space-x-2"
          >
            <span>🚀</span>
            <span>Share Canvas</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm">Made with 💖 and 🎨</p>
      </div>
    </div>
  );
}