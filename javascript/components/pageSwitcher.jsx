import React from "react";

const PageSwitcher = ({ current_page, total_pages, onPageChange }) => {
  if (total_pages <= 1) {
    return null;
  }

  const maxVisiblePages = 10; // Show maximum 10 page buttons at a time
  const currentPageZeroBased = current_page - 1; // Convert to 0-based for calculations
  let startPage = 0;
  let endPage = total_pages - 1;

  // Calculate the visible page range (sliding window of maxVisiblePages)
  if (total_pages > maxVisiblePages) {
    startPage = Math.max(0, currentPageZeroBased - Math.floor(maxVisiblePages / 2));
    endPage = startPage + maxVisiblePages - 1;
    
    // Adjust if we're at the end
    if (endPage >= total_pages) {
      endPage = total_pages - 1;
      startPage = endPage - maxVisiblePages + 1;
    }
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const arrowButtons = [
    { 
      text: "<<", 
      page: 0, 
      disabled: currentPageZeroBased === 0,
      hidden: currentPageZeroBased < maxVisiblePages / 2 
    },
    { 
      text: "<", 
      page: currentPageZeroBased - 1, 
      disabled: currentPageZeroBased === 0 
    },
    { 
      text: ">", 
      page: currentPageZeroBased + 1, 
      disabled: currentPageZeroBased >= total_pages - 1 
    },
    { 
      text: ">>", 
      page: total_pages - 1, 
      disabled: currentPageZeroBased >= total_pages - 1,
      hidden: currentPageZeroBased >= total_pages - maxVisiblePages / 2 - 1
    },
  ];

  return (
    <section id="page_switcher_section" className="container mt-4">
      <div id="page_switcher_container" className="container">
        <nav>
          <ul className="pagination justify-content-center">
            {arrowButtons.map((arrow) => (
              !arrow.hidden && (
                <li 
                  className={`page-item ${arrow.disabled ? "disabled" : ""}`} 
                  key={arrow.text}
                >
                  <button
                    className="page-link"
                    onClick={() => onPageChange(arrow.page + 1)}
                    disabled={arrow.disabled}
                  >
                    {arrow.text}
                  </button>
                </li>
              )
            ))}

            {pageNumbers.map((number) => (
              <li
                className={`page-item ${number === currentPageZeroBased ? "active" : ""}`}
                key={number}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(number + 1)}
                  disabled={number === currentPageZeroBased}
                >
                  {number + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default PageSwitcher;