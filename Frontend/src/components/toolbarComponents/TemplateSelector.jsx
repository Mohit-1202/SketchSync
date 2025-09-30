/* eslint-disable no-undef */
import { useState } from 'react';

const TemplateSelector = ({ canvas, isDarkTheme }) => {
  // Component manages its OWN state
  const [currentTemplate, setCurrentTemplate] = useState("default");

  const designTemplates = [
    { id: "default", name: "Default", color: "#3B82F6" },
    { id: "modern", name: "Modern", color: "#10B981" },
    { id: "elegant", name: "Elegant", color: "#8B5CF6" },
    { id: "vibrant", name: "Vibrant", color: "#EC4899" },
    { id: "minimal", name: "Minimal", color: "#64748B" }
  ];

  // Component has its OWN template logic
  const applyTemplate = (templateId) => {
    setCurrentTemplate(templateId);
    
    const obj = canvas?.getActiveObject();
    if (!obj) return;

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
        strokeColor: isDarkTheme ? "#ffffff" : "#000000",
        strokeWidth: 2,
        shadowEnabled: false,
        gradientEnabled: false
      }
    };

    const template = templates[templateId] || templates.default;

    try {
      // Apply template styles to selected object
      if (template.opacity !== undefined) {
        obj.set({ opacity: template.opacity / 100 });
      }

      // Apply shadow
      if (template.shadowEnabled !== undefined) {
        if (template.shadowEnabled) {
          const shadow = new fabric.Shadow({
            color: template.shadowColor || "#000000",
            blur: parseInt(template.shadowBlur) || 10,
            offsetX: parseInt(template.shadowOffsetX) || 5,
            offsetY: parseInt(template.shadowOffsetY) || 5
          });
          obj.set({ shadow: shadow });
        } else {
          obj.set({ shadow: null });
        }
      }

      // Apply stroke
      if (template.strokeEnabled !== undefined) {
        if (template.strokeEnabled) {
          obj.set({
            stroke: template.strokeColor || (isDarkTheme ? "#ffffff" : "#000000"),
            strokeWidth: template.strokeWidth || 2
          });
        } else {
          obj.set({ stroke: '', strokeWidth: 0 });
        }
      }

      // Apply fill or gradient (not for lines)
      if (obj.type !== "line") {
        if (template.fillColor !== undefined) {
          obj.set({ fill: template.fillColor === "transparent" ? '' : template.fillColor });
        }

        // Handle gradient
        if (template.gradientEnabled && obj.type !== "text") {
          let gradient;
          if (template.gradientType === "linear") {
            gradient = new fabric.Gradient({
              type: 'linear',
              gradientUnits: 'pixels',
              coords: { x1: 0, y1: 0, x2: obj.width, y2: 0 },
              colorStops: [
                { offset: 0, color: template.gradientColor1 || "#666666" },
                { offset: 1, color: template.gradientColor2 || "#999999" }
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
                { offset: 0, color: template.gradientColor1 || "#666666" },
                { offset: 1, color: template.gradientColor2 || "#999999" }
              ]
            });
          }
          obj.set({ fill: gradient });
        }
      }

      // Apply border radius to rectangles
      if (obj.type === "rect" && template.borderRadius !== undefined) {
        obj.set({ rx: template.borderRadius, ry: template.borderRadius });
      }

      canvas.renderAll();
    } catch (error) {
      console.error("Error applying template:", error);
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
                ? `${accentBorder} ${accentBg}`
                : `${borderColor} ${cardBg} ${hoverBg}`
            }`}
          >
            <div 
              className="w-full h-8 rounded mb-1 border border-gray-600"
              style={{ backgroundColor: template.color }}
            />
            <span className={`text-xs ${mutedText}`}>{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;