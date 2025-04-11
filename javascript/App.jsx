import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SearchPage from "./components/search-page";
import Authentication from "./components/auth";
import Register from "./components/register"; // Import the registration component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/register" element={<Register />} /> {/* Add the registration route */}
        <Route path="/search-page" element={<SearchPage />} />
        <Route path="/results-page" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};

export default App;