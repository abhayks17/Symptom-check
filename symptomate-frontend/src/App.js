// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Interview from "./pages/Interview";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Interview />} />
      </Routes>
    </Router>
  );
}

export default App;
