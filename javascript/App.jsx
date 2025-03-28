import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import SearchPage from "./components/search-page";
import Authentication from "./components/auth";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to='/auth' />} />
        <Route path="/auth" element={<Authentication />} />
        <Route path="/search-page" element={<SearchPage />} />
        <Route path="/results-page" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};

export default App;