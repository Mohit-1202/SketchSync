import { db } from "./services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function testFirestore() {
  const docRef = doc(db, "testCollection", "testDoc");

  await setDoc(docRef, { message: "Hello Firebase!" });
  console.log("Document written successfully!");

  const snap = await getDoc(docRef);
  console.log("Document data:", snap.data());
}

