import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "/styles/styles.css";
import ResultsSection from "./results";

const API_GATEWAY_URL = import.meta.env.VITE_GATEWAY_API_URL || GATEWAY_API_URL;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [pageNumber, setPageNumber] = useState(parseInt(searchParams.get("page")) || 1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page")) || 1;
    if (q) {
      fetchResults(q, page - 1); // Convert to 0-based for API
    }
  }, [searchParams]);

  const getStartDateString = (dateParam) => {
    if (dateParam === "all") {
      return "1900-01-01 00:00:00.000-0400";
    }

    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'America/New_York',
    });
    const parts = formatter.formatToParts(now);
    let year, month, day;
    parts.forEach(part => {
      if (part.type === 'year') year = parseInt(part.value);
      else if (part.type === 'month') month = parseInt(part.value);
      else if (part.type === 'day') day = parseInt(part.value);
    });

    let startYear = year;
    let startMonth = month;
    let startDay = day;

    const match = dateParam.match(/^(\d+)(month|year)s?$/);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[2];
      if (unit === 'month') {
        startMonth -= num;
        while (startMonth < 1) {
          startMonth += 12;
          startYear -= 1;
        }
      } else if (unit === 'year') {
        startYear -= num;
      }
    } else {
      // Default to all time if invalid
      return "1900-01-01 00:00:00.000-0400";
    }

    return `${startYear.toString().padStart(4, '0')}-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')} 00:00:00.000-0400`;
  };

  // Fetch search results from the API
  const fetchResults = async (term, pageNum = 0) => {
    if (!term?.trim()) {
      setError("Please enter a search term.");
      setResults(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const date = searchParams.get("date") || "all";
      const startDate = getStartDateString(date);
      const endDate = "2100-01-01 00:00:00.000-0400";

      const query_params = new URLSearchParams();
      query_params.append("searchTerm", term);
      query_params.append("pageNumber", pageNum);
      query_params.append("refreshResults", true);
      query_params.append("sortParams", JSON.stringify({
        "desc": true,
        "sortType": "relevance"
      }));
      query_params.append("filterParams", JSON.stringify({
        "dateRange": {
          "start": startDate,
          "end": endDate
        },
        "docketType": "Rulemaking"
      }));

      const url = `${API_GATEWAY_URL}?${query_params.toString()}`;

      const headers = {
        "Session-Id": "test",
        "Content-Type": "application/json"
      };

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.dockets || (Array.isArray(data.dockets) && data.dockets.length === 0)) {
        throw new Error("No results found. Please try a different search term.");
      }

      setResults(data);
      setSearchTerm(term);
      setPageNumber(pageNum);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setError(null);
    const term = searchTerm.trim();
    if (term) {
      setSearchParams(prev => ({ ...prev, q: term, page: 1 }));
    } else {
      setError("Please enter a search term.");
    }
  };

  const handlePageChange = (newPageNumber) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchParams({ q: searchTerm, page: newPageNumber + 1 });
    fetchResults(searchTerm, newPageNumber);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("idToken");
    setIsAuthenticated(false);
    navigate("/auth");
  };

  const LoadingMessage = () => {
    const [dots, setDots] = useState("");
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    }, []);
    return (
      <p id="searching-section" className="text-center mt-3">
        Loading{dots} (this is harder than it looks!)
      </p>
    );
  };

  return (
    <div className="search-container p-0">
      <h1 className="logo">Mirrulations</h1>
      <button className="btn btn-primary position-absolute top-0 end-0 m-3" onClick={handleLogout}>
        Logout
      </button>
      <section className="search-section">
        <div id="search" className="d-flex justify-content-center align-items-center">
          <input
            type="text"
            className="search-input form-control w-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term"
            onKeyDown={handleKeyPress}
          />
          <select
            className="form-select ms-2"
            style={{ width: "150px" }}
            value={searchParams.get("date") || "all"}
            onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value, page: 1 }))}
          >
            <option value="1month">Last Month</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="5years">Last 5 Years</option>
            <option value="10years">Last 10 Years</option>
            <option value="all">All Time</option>
          </select>
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
      {loading && <LoadingMessage />}
      {error && <p id="error-loader" className="text-center mt-3">{error}</p>}
      {results && <ResultsSection results={results} onPageChange={handlePageChange}/>}
    </div>
  );
};

export default SearchPage;