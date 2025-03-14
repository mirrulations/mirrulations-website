import React from "react";

const ResultsSection = ({ results }) => {
  return (
    <section id="results_section" className="container mt-4">
      <div id="results_container" className="container">
        {results && results.length > 0 && (
          <ul className="list-group">
            {results.map((item, index) => (
              <li key={index} className="list-group-item">
                <strong>{item.docketTitle}</strong>  
                <p>ID: {item.docketID} - Matching Comments: {item.matching_comments}/{item.doc_count}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ResultsSection;
