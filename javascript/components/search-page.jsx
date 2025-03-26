import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/styles.css";
import ResultsSection from "./results";

const API_GATEWAY_URL = import.meta.env.VITE_GATEWAY_API_URL || GATEWAY_API_URL;

console.log("API_GATEWAY_URL:", API_GATEWAY_URL);

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term.");
      setResults(null);
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${API_GATEWAY_URL}?name=${searchTerm}`, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        console.log(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
  
      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error("No results found. Please try a different search term.");
      }
  
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  
  return (
    <div className="search-container p-0">
        <h1 className="logo">Mirrulations</h1>
        <button className="btn btn-secondary position-absolute top-0 end-0 m-3">
          Logout
        </button>
      <section className="search-section">
        <div id="search" className="d-flex justify-content-center">
          <input
            type="text"
            className="search-input form-control w-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term"
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSearch}
            className="search-button btn btn-primary ms-2"
          >
            Search
          </button>
        </div>
      </section>
      <p className="footer">
        <a href="https://www.flickr.com/photos/wallyg/3664385777">Washington DC - Capitol Hill: United States Capitol</a>
        <span> by </span><a href="https://www.flickr.com/photos/wallyg/">Wally Gobetz</a>
        <span> is licensed under </span><a href="https://creativecommons.org/licenses/by-nc-nd/2.0/">CC BY-NC-ND 2.0</a>
      </p>

      {loading && <p id="loading-section" className="text-center mt-3">Loading...</p>}
      {error && <p id="error-loader" className="text-center mt-3">{error}</p>}

      {results && <ResultsSection results={results} />}
    </div>
  );
};

export default SearchPage;