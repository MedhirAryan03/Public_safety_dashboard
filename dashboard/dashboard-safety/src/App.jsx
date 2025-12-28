import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Trial from "./pages/Trial";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <Routes>
      {/* Shared layout */}
      <Route element={<MainLayout />}>

        <Route path="/" element={<Trial />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Route>
    </Routes>
  );
}

export default App;
