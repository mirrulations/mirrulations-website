import React, { useState, useEffect, useRef } from "react";
import "/styles/results.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageSwitcher from "./PageSwitcher";

const ResultsSection = ({ results, updateSearch }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [sortParam, setSortParam] = useState('matchQuality');
  const resultsRef = useRef(null);

  useEffect(() => {
    if (results.dockets.length > 0) {
      setIsVisible(true);
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  const handleDateChange = (event) => {
    const range = event.target.value;
    setDateRange(range);
    updateSearch({ dateRange: convertToDateRange(range) });
  };

  const convertToDateRange = (range) => {
    let now = new Date();
    let start, end = now.toISOString();

    switch(range) {
      case 'last6Months':
        start = new Date(now.setMonth(now.getMonth() - 6)).toISOString();
        break;
      case 'lastYear':
        start = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
        break;
      case 'last2Years':
        start = new Date(now.setFullYear(now.getFullYear() - 2)).toISOString();
        break;
      default:
        start = null;
        end = null;
    }

    return { start, end };
  };

  const handleSortChange = (event) => {
    setSortParam(event.target.value);
    updateSearch({ sortField: event.target.value });
  };

  return (
    <div ref={resultsRef} className={`results-container mt-4 ${isVisible ? "fade-in" : ""}`}>
      <h2 className="results-title">Search Results</h2>
      <div>
        <select value={dateRange} onChange={handleDateChange}>
          <option value="all">All Dates</option>
          <option value="last6Months">Last 6 Months</option>
          <option value="lastYear">Last Year</option>
          <option value="last2Years">Last 2 Years</option>
        </select>
        <select value={sortParam} onChange={handleSortChange}>
          <option value="matchQuality">Relevance</option>
          <option value="comments.match">Comments Match</option>
          <option value="attachments.match">Attachments Match</option>
        </select>
      </div>
      {results.dockets.map((docket, index) => (
        <div key={index} className="result-item border p-3 mb-2 rounded">
          <strong>{docket.title}</strong>
          <p><strong>Agency Name:</strong> {docket.agencyName}</p>
          <p><strong>Docket ID: </strong> 
            <a href={`https://www.regulations.gov/docket/${docket.id}`} target="_blank" rel="noopener noreferrer">
              {docket.id}
            </a>
          </p>
          <p><strong>Matching Comments:</strong> {docket.comments.match}/{docket.comments.total}</p>
          <p><strong>Matching Attachments:</strong> {docket.attachments ? `${docket.attachments.match}/${docket.attachments.total}` : "Unknown"}</p>
          <p>
            <strong>Date Modified:</strong> { docket.timelineDates && docket.timelineDates.dateModified ? new Date(docket.timelineDates.dateModified).toLocaleDateString() : "Unknown"}
            <strong>&emsp;Date Created:</strong> { docket.timelineDates && docket.timelineDates.dateCreated ? new Date(docket.timelineDates.dateCreated).toLocaleDateString() : "Unknown"}
            <strong>&emsp;Date Effective:</strong> { docket.timelineDates && docket.timelineDates.dateEffective ? new Date(docket.timelineDates.dateEffective).toLocaleDateString() : "Unknown" }
            <strong>&emsp;Date Closed:</strong> { docket.timelineDates && docket.timelineDates.dateClosed ? new Date(docket.timelineDates.dateClosed).toLocaleDateString() : "Unknown" }
            <strong>&emsp;Date Comments Opened:</strong> { docket.timelineDates && docket.timelineDates.dateCommentsOpened ? new Date(docket.timelineDates.dateCommentsOpened).toLocaleDateString() : "Unknown" }
          </p>
        </div>
      ))}
      <PageSwitcher current_page={results.currentPage} total_pages={results.totalPages} />
    </div>
  );
};

export default ResultsSection;

