import React from "react";

const PageSwitcher = ({ current_page, total_pages, onPageChange }) => {
    if (total_pages <= 1) {
      return null;
    }
  
    const pageNumbers = [];
    const maxPagesToShow = 10;
  
    let startPage = Math.max(0, current_page - 1);
    let endPage = Math.min(total_pages - 1, current_page + 1);
  
    if (current_page <= 0) {
      endPage = Math.min(total_pages - 1, maxPagesToShow - 1);
    } else if (current_page >= total_pages - 1) {
      startPage = Math.max(0, total_pages - maxPagesToShow);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    const arrowButtons = [
        { text: "<<", page: 0, disabled: current_page === 0 },
        { text: "<", page: current_page - 1, disabled: current_page === 0 },
        { text: ">", page: current_page + 1, disabled: current_page === maxPagesToShow - 1 },
        { text: ">>", page: maxPagesToShow, disabled: current_page === maxPagesToShow - 1 },
      ];
    
    return (
    <section id="page_switcher_section" className="container mt-4">
      <div id="page_switcher_container" className="container">
        <nav>
          <ul className="pagination justify-content-center">
            {arrowButtons.slice(0, 2).map((arrow) => (
              <li className={`page-item ${arrow.disabled ? "disabled" : ""}`} key={arrow.text}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(arrow.page)}
                  disabled={arrow.disabled}
                >
                  {arrow.text}
                </button>
              </li>
            ))}

            {pageNumbers.map((number) => (
              <li
                className={`page-item ${number === current_page ? "active" : ""}`}
                key={number}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(number)}
                  disabled={number === current_page}
                >
                  {number + 1}
                </button>
              </li>
            ))}

            {arrowButtons.slice(2).map((arrow) => (
              <li className={`page-item ${arrow.disabled ? "disabled" : ""}`} key={arrow.text}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(arrow.page)}
                  disabled={arrow.disabled}
                >
                  {arrow.text}
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