import PageSwitcher from "./pageSwitcher";
import React, { useEffect, useState, useRef } from "react";
import "/styles/results.css";
import "bootstrap/dist/css/bootstrap.min.css";
import hammerIcon from "../../icons/hammer.png";
import pencilIcon from "../../icons/pencil.png";
import TimelineModal from "./timelineModal";

const ResultsSection = ({ results, onPageChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const resultsRef = useRef(null);

  const getDocketIcon = (docket) => {
    const isRulemaking = docket.docketType === "Rulemaking";
    return isRulemaking ? hammerIcon : pencilIcon;
  };

  useEffect(() => {
    if (results.dockets.length > 0) {
      setIsVisible(true);
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [results]);

  return (
    <div ref={resultsRef} className={`results-container mt-4 ${isVisible ? "fade-in" : ""}`}>
      <h2 className="results-title">Search Results</h2>
      {results.dockets.map((docket, index) => (
        <div key={index} className="result-item border p-3 mb-2 rounded">
          <div className="d-flex justify-content-between">
            <div className="result-content">
              <strong>{docket.title}</strong>
              <p><strong>Agency Name:</strong> {docket.agencyName}</p>
              <p>
                <strong>Docket ID: </strong> 
                <a href={`https://www.regulations.gov/docket/${docket.id}`} target="_blank" rel="noopener noreferrer">
                  {docket.id}
                </a>
              </p>
              <p><strong>Matching Comments:</strong> {docket.comments.match}/{docket.comments.total}</p>
              <p><strong>Matching Attachments:</strong> {docket.attachments ? `${docket.attachments.match}/${docket.attachments.total}` : "Unknown"}</p>
              <p><strong>Summary:</strong> {docket.summary ? (docket.summary.length > 300 ? `${docket.summary.substring(0, 300)}...` : docket.summary) : "No summary available"}</p>
              {/* Use the new TimelineModal component instead of displaying dates directly */}
              <TimelineModal key={docket.id} timelineDates={docket.timelineDates}/>
            </div>
            
            <div className="d-flex align-items-end">
              <img 
                src={getDocketIcon(docket)} 
                alt={docket.docketType === "Rulemaking" ? "Rulemaking icon" : "Non-rulemaking icon"} 
                className="docket-icon"
                title={docket.docketType === "Rulemaking" ? "Rulemaking" : "Non-rulemaking"}
              />
            </div>
          </div>
        </div>
      ))}
      <PageSwitcher current_page={Number(results.currentPage) + 1} total_pages={results.totalPages} onPageChange={(page) => onPageChange(page - 1)}/>
    </div>
  );
};

export default ResultsSection;