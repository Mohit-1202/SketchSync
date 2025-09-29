import { useParams } from "react-router-dom";
import { useState } from "react";
import CanvasEditor from "../components/CanvasEditor";
import Toolbar from "../components/Toolbar";

export default function CanvasPage() {
  const { id } = useParams();
  const [canvasInstance, setCanvasInstance] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      <Toolbar canvas={canvasInstance} />
      <div className="flex-1 flex justify-center items-center">
        <CanvasEditor sceneId={id} setCanvasInstance={setCanvasInstance} />
      </div>
    </div>
  );
}
