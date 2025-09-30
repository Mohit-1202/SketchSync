import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric"; 
import { db } from "../services/firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

export default function CanvasEditor({ sceneId, setCanvasInstance }) {
  const canvasRef = useRef(null);
  const [objectCount, setObjectCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const fabricCanvas = useRef(null);
  const lastSavedAtRef = useRef(0);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const canvasWidth = isMobile ? window.innerWidth : window.innerWidth - 320;
    const canvasHeight = isMobile ? window.innerHeight - 80 : window.innerHeight;

    const canvas = new fabric.Canvas(canvasRef.current, {
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

    const docRef = doc(db, "scenes", sceneId);
    let saveTimeout;

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

    canvas.on("object:added", () => {
      saveCanvas();
      setObjectCount(canvas.getObjects().length);
    });
    canvas.on("object:modified", saveCanvas);
    canvas.on("object:removed", () => {
      saveCanvas();
      setObjectCount(canvas.getObjects().length);
    });

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

    const handleResize = () => {
      if (!fabricCanvas.current || fabricCanvas.current.isDisposed) return;
      const newWidth = isMobile ? window.innerWidth : window.innerWidth - 320;
      const newHeight = isMobile ? window.innerHeight - 80 : window.innerHeight;
      
      fabricCanvas.current.setDimensions({
        width: newWidth,
        height: newHeight,
      });
      fabricCanvas.current.renderAll();
    };

    window.addEventListener("resize", handleResize);

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

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, [sceneId, setCanvasInstance, isMobile]);


  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* object count - Position differently on mobile */}
      <div className={`absolute ${isMobile ? 'bottom-16 left-4' : 'bottom-4 left-4'} bg-gray-800/70 text-white px-4 py-2 rounded-lg z-20 backdrop-blur-sm`}>
        Objects: {objectCount}
      </div>

      {/* main canvas - Full screen on mobile */}
      <canvas
        ref={canvasRef}
        className={`relative z-10 ${isMobile ? 'w-full h-full rounded-none' : 'rounded-2xl shadow-2xl border-2 border-gray-600/30'}`}
      />
    </div>
  );
}