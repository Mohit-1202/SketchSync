import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const loadCanvas = async (sceneId) => {
  const docRef = doc(db, "canvases", sceneId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().state : null;
};

export const saveCanvas = async (sceneId, canvasData) => {
  const docRef = doc(db, "canvases", sceneId);
  await setDoc(docRef, { state: canvasData });
};
