/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState, useCallback } from "react";
import { fabric } from "fabric";
import { loadCanvas, saveCanvas } from "../services/firestoreService";
import useDebounce from "../hooks/useDebounce";

export default function CanvasEditor({ sceneId, setCanvasInstance }) {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [objectCount, setObjectCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const saveCanvasData = useCallback(async () => {
    if (!fabricCanvas.current || !sceneId) return;
    setSaveStatus("saving");
    try {
      const canvasData = fabricCanvas.current.toJSON();
      await saveCanvas(sceneId, canvasData);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }
  }, [sceneId]);

  const debouncedSave = useDebounce(saveCanvasData, 1000);

  const loadFromJSONAsync = (canvas, json) => {
    return new Promise((resolve, reject) => {
      try {
        canvas.loadFromJSON(
          json,
          () => {
            canvas.renderAll();
            resolve();
          },
          () => {}
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const canvasWidth = Math.max(200, isMobile ? window.innerWidth : window.innerWidth - 320);
    const canvasHeight = Math.max(200, isMobile ? window.innerHeight - 80 : window.innerHeight);

    const canvas = new fabric.Canvas(el, {
      backgroundColor: "#0f172a",
      width: canvasWidth,
      height: canvasHeight,
      preserveObjectStacking: true,
      selectionColor: "rgba(59, 130, 246, 0.3)",
      selectionBorderColor: "#3b82f6",
      selectionLineWidth: 2,
    });

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = "#00aaff";

    fabricCanvas.current = canvas;
    if (setCanvasInstance) setCanvasInstance(canvas);

    canvas.manualSave = saveCanvasData;

    const onObjectAdded = () => {
      setObjectCount(canvas.getObjects().length);
      debouncedSave();
    };
    const onObjectModified = () => {
      debouncedSave();
    };
    const onObjectRemoved = () => {
      setObjectCount(canvas.getObjects().length);
      debouncedSave();
    };

    canvas.on("object:added", onObjectAdded);
    canvas.on("object:modified", onObjectModified);
    canvas.on("object:removed", onObjectRemoved);

    (async () => {
      try {
        const data = await loadCanvas(sceneId);
        if (data && data.objects && data.objects.length > 0) {
          await loadFromJSONAsync(canvas, data);
          setObjectCount(canvas.getObjects().length);
        } else {
          setTimeout(() => saveCanvasData().catch(() => {}), 600);
        }
      } catch {
        setTimeout(() => saveCanvasData().catch(() => {}), 600);
      }
    })();

    const handleResize = () => {
      if (!fabricCanvas.current) return;
      const w = Math.max(200, isMobile ? window.innerWidth : window.innerWidth - 320);
      const h = Math.max(200, isMobile ? window.innerHeight - 80 : window.innerHeight);
      fabricCanvas.current.setDimensions({ width: w, height: h });
      fabricCanvas.current.renderAll();
    };

    const handleKeyDown = (e) => {
      if (!fabricCanvas.current) return;
      const active = fabricCanvas.current.getActiveObjects && fabricCanvas.current.getActiveObjects();
      if ((e.key === "Delete" || e.key === "Backspace") && active && active.length) {
        e.preventDefault();
        active.forEach((obj) => fabricCanvas.current.remove(obj));
        fabricCanvas.current.discardActiveObject();
        fabricCanvas.current.requestRenderAll();
        setObjectCount(fabricCanvas.current.getObjects().length);
        debouncedSave();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.off("object:added", onObjectAdded);
      canvas.off("object:modified", onObjectModified);
      canvas.off("object:removed", onObjectRemoved);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      try {
        canvas.dispose();
      } catch(err) {
        console.log(err)
      }
      fabricCanvas.current = null;
    };
  }, [sceneId, setCanvasInstance, isMobile, saveCanvasData, debouncedSave]);

  const getStatusColor = () => {
    switch (saveStatus) {
      case "saving":
        return "bg-yellow-500";
      case "saved":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved!";
      case "error":
        return "Save Failed";
      default:
        return "All changes saved";
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden">
      <div className="absolute top-4 right-4 bg-gray-800/70 text-white px-3 py-1 rounded-lg z-20 backdrop-blur-sm flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span className="text-sm">{getStatusText()}</span>
        <button
          onClick={saveCanvasData}
          className="ml-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
        >
          Save Now
        </button>
      </div>

      <div
        className={`absolute ${isMobile ? "bottom-16 left-4" : "bottom-4 left-4"} bg-gray-800/70 text-white px-4 py-2 rounded-lg z-20 backdrop-blur-sm`}
      >
        Objects: {objectCount}
      </div>

      <canvas
        ref={canvasRef}
        className={`relative z-10 ${isMobile ? "w-full h-full rounded-none" : "rounded-2xl shadow-2xl border-2 border-gray-600/30"}`}
      />
    </div>
  );
}
