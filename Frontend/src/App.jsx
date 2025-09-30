import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CanvasPage from "./pages/CanvasPage";
import AboutPage from "./pages/AboutPage";
// import Navbar from "./components/Navbar";


export default function App() {

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
