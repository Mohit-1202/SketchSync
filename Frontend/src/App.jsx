import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CanvasPage from "./pages/CanvasPage";
import AboutPage from "./pages/AboutPage";
// import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./services/firebase";

export default function App() {
    useEffect(() => {
    const testFirestore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "scenes"));
        console.log("🔥 Firestore connected! Documents found:", querySnapshot.size);

        await setDoc(doc(db, "scenes", "test123"), { foo: "bar" });
        console.log("✅ Write successful! Check Firestore console.");
      } catch (err) {
        console.error("❌ Firestore test failed:", err);
      }
    };

    testFirestore();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canvas/:id" element={<CanvasPage />} />
        <Route path="/about" element={<AboutPage/>} />
      </Routes>
    </BrowserRouter>
  );
}
