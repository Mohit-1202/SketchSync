import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CanvasPage from "./pages/CanvasPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canvas/:id" element={<CanvasPage />} />
      </Routes>
    </BrowserRouter>
  );
}
