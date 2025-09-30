import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";


export const loadCanvas = async (sceneId) => {
  if (!sceneId) {
    console.error("loadCanvas: missing sceneId");
    return null;
  }
  try {
    const docRef = doc(db, "scenes", sceneId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      console.log("loadCanvas: no document for", sceneId);
      return null;
    }
    const data = snap.data();
    if (!data?.data) {
      console.log("loadCanvas: document exists but has no data field:", sceneId);
      return null;
    }
    const parsed = JSON.parse(data.data);
    return parsed;
  } catch (err) {
    console.error("loadCanvas: error loading canvas:", err);
    return null;
  }
};

export const saveCanvas = async (sceneId, canvasData) => {
  if (!sceneId) {
    throw new Error("saveCanvas: missing sceneId");
  }
  try {
    const docRef = doc(db, "scenes", sceneId);
    const serializable = JSON.stringify(canvasData);
    await setDoc(docRef, {
      data: serializable,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("saveCanvas: failed to save:", err);
    throw err;
  }
};
