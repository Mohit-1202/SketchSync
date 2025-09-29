import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric"; // ✅ correct import
import { db } from "../services/firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

export default function CanvasEditor({ sceneId, setCanvasInstance }) {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(100);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [objectCount, setObjectCount] = useState(0);
  const fabricCanvas = useRef(null);
  const lastSavedAtRef = useRef(0);

  useEffect(() => {
    // ✅ initialize fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#0f172a",
      width: window.innerWidth - 320,
      height: window.innerHeight,
      preserveObjectStacking: true,
      selectionColor: "rgba(59, 130, 246, 0.3)",
      selectionBorderColor: "#3b82f6",
      selectionLineWidth: 2,
    });

    // default brush for drawing
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = "#00aaff";

    fabricCanvas.current = canvas;
    if (setCanvasInstance) setCanvasInstance(canvas);

    const docRef = doc(db, "scenes", sceneId);
    let saveTimeout;

    // ✅ save canvas to Firestore
    const saveCanvas = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        if (!fabricCanvas.current || fabricCanvas.current.isDisposed) return;
        lastSavedAtRef.current = Date.now();
        await setDoc(docRef, {
          data: fabricCanvas.current.toJSON([
            "selectable",
            "stroke",
            "strokeWidth",
            "fontSize",
            "fontWeight",
            "fontStyle",
          ]),
          updatedAt: lastSavedAtRef.current,
        });
      }, 500);
    };

    // ✅ update events
    canvas.on("object:added", () => {
      saveCanvas();
      setObjectCount(canvas.getObjects().length);
    });
    canvas.on("object:modified", saveCanvas);
    canvas.on("object:removed", () => {
      saveCanvas();
      setObjectCount(canvas.getObjects().length);
    });

    // ✅ load initial canvas state
    const loadCanvas = async () => {
      if (!fabricCanvas.current || fabricCanvas.current.isDisposed) return;
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        await fabricCanvas.current.loadFromJSON(snap.data().data);
        fabricCanvas.current.renderAll();
        setObjectCount(fabricCanvas.current.getObjects().length);
      }
    };
    loadCanvas();

    // ✅ real-time Firestore sync
    const unsubscribe = onSnapshot(docRef, async (snap) => {
      if (!fabricCanvas.current || fabricCanvas.current.isDisposed) return;
      if (!snap.exists()) return;

      const serverData = snap.data();
      if (
        serverData.updatedAt &&
        serverData.updatedAt > lastSavedAtRef.current
      ) {
        await fabricCanvas.current.loadFromJSON(serverData.data);
        fabricCanvas.current.renderAll();
        setObjectCount(fabricCanvas.current.getObjects().length);
      }
    });

    // ✅ handle window resize
    const handleResize = () => {
      if (!fabricCanvas.current || fabricCanvas.current.isDisposed) return;
      fabricCanvas.current.setDimensions({
        width: window.innerWidth - 320,
        height: window.innerHeight,
      });
      fabricCanvas.current.renderAll();
    };

    window.addEventListener("resize", handleResize);

    // ✅ handle delete key
    const handleKeyDown = (e) => {
      if (!fabricCanvas.current || fabricCanvas.current.isDisposed) return;
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        fabricCanvas.current.getActiveObject()
      ) {
        e.preventDefault();
        const activeObjects = fabricCanvas.current.getActiveObjects();
        activeObjects.forEach((obj) => fabricCanvas.current.remove(obj));
        fabricCanvas.current.discardActiveObject();
        fabricCanvas.current.renderAll();
        setObjectCount(fabricCanvas.current.getObjects().length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // ✅ cleanup
    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, [sceneId, setCanvasInstance]);

  // ✅ zoom in
  const zoomIn = () => {
    setZoom((prev) => {
      const newZoom = Math.min(prev + 10, 200);
      if (fabricCanvas.current && !fabricCanvas.current.isDisposed) {
        fabricCanvas.current.setZoom(newZoom / 100);
        fabricCanvas.current.renderAll();
      }
      return newZoom;
    });
  };

  // ✅ zoom out
  const zoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 10, 50);
      if (fabricCanvas.current && !fabricCanvas.current.isDisposed) {
        fabricCanvas.current.setZoom(newZoom / 100);
        fabricCanvas.current.renderAll();
      }
      return newZoom;
    });
  };

  // ✅ reset zoom
  const resetZoom = () => {
    setZoom(100);
    if (fabricCanvas.current && !fabricCanvas.current.isDisposed) {
      fabricCanvas.current.setZoom(1);
      fabricCanvas.current.renderAll();
    }
  };

  // ✅ toggle grid (placeholder)
  const toggleGrid = () => setIsGridVisible(!isGridVisible);

  // ✅ center content
  const centerContent = () => {
    if (!fabricCanvas.current || fabricCanvas.current.isDisposed) return;
    const objects = fabricCanvas.current.getObjects();
    if (objects.length === 0) return;
    objects.forEach((obj) => {
      obj.set({
        left: fabricCanvas.current.getWidth() / 2 - obj.width / 2,
        top: fabricCanvas.current.getHeight() / 2 - obj.height / 2,
      });
    });
    fabricCanvas.current.renderAll();
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* toolbar UI buttons */}
      <div className="absolute top-4 left-4 flex space-x-3 z-20">
        <button onClick={zoomIn} className="px-4 py-2 bg-gray-800/70 text-white rounded-lg">
          Zoom In
        </button>
        <button onClick={zoomOut} className="px-4 py-2 bg-gray-800/70 text-white rounded-lg">
          Zoom Out
        </button>
        <button
          onClick={resetZoom}
          className="px-4 py-2 bg-gray-800/70 text-white rounded-lg"
        >
          Reset Zoom
        </button>
        <button
          onClick={toggleGrid}
          className="px-4 py-2 bg-gray-800/70 text-white rounded-lg"
        >
          {isGridVisible ? "Hide Grid" : "Show Grid"}
        </button>
        <button
          onClick={centerContent}
          className="px-4 py-2 bg-gray-800/70 text-white rounded-lg"
        >
          Center
        </button>
      </div>

      {/* object count */}
      <div className="absolute bottom-4 left-4 bg-gray-800/70 text-white px-4 py-2 rounded-lg z-20">
        Objects: {objectCount}
      </div>

      {/* main canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 rounded-2xl shadow-2xl border-2 border-gray-600/30"
        style={{
          cursor: "crosshair",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      />
    </div>
  );
}
