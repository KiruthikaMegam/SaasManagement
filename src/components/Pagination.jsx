import React from "react";

import arrowLeftIcon from "../assets/arrow-left.png";
import arrowRightIcon from "../assets/arrow-right.png";

import "./Pagination.css";

function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) {
  if (totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.min(
    Math.max(currentPage, 1),
    totalPages
  );

  const pages = [];

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }
  } else {
    pages.push(1);

    if (safeCurrentPage > 4) {
      pages.push("left-ellipsis");
    }

    let startPage = Math.max(2, safeCurrentPage - 1);
    let endPage = Math.min(
      totalPages - 1,
      safeCurrentPage + 1
    );

    if (safeCurrentPage <= 3) {
      startPage = 2;
      endPage = 4;
    }

    if (safeCurrentPage >= totalPages - 2) {
      startPage = totalPages - 3;
      endPage = totalPages - 1;
    }

    for (
      let page = startPage;
      page <= endPage;
      page += 1
    ) {
      pages.push(page);
    }

    if (safeCurrentPage < totalPages - 3) {
      pages.push("right-ellipsis");
    }

    pages.push(totalPages);
  }

  const handlePrevious = () => {
    if (
      safeCurrentPage > 1 &&
      typeof onPageChange === "function"
    ) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (
      safeCurrentPage < totalPages &&
      typeof onPageChange === "function"
    ) {
      onPageChange(safeCurrentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (
      typeof page !== "number" ||
      page === safeCurrentPage
    ) {
      return;
    }

    if (typeof onPageChange === "function") {
      onPageChange(page);
    }
  };

  return (
    <nav
      className="saas-pagination"
      aria-label="Pagination"
    >
      <div className="saas-pagination-info">
        Page{" "}
        <strong>{safeCurrentPage}</strong>{" "}
        of{" "}
        <strong>{totalPages}</strong>
      </div>

      <div className="saas-pagination-controls">
        <button
          type="button"
          className="saas-pagination-arrow"
          onClick={handlePrevious}
          disabled={safeCurrentPage === 1}
          aria-label="Previous page"
        >
          <img
            src={arrowLeftIcon}
            alt=""
          />
        </button>

        <div className="saas-pagination-pages">
          {pages.map((page, index) => {
            if (typeof page !== "number") {
              return (
                <span
                  key={`${page}-${index}`}
                  className="saas-pagination-ellipsis"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const isActive = page === safeCurrentPage;

            return (
              <button
                type="button"
                key={page}
                className={
                  isActive
                    ? "saas-pagination-page saas-pagination-page-active"
                    : "saas-pagination-page"
                }
                onClick={() => handlePageClick(page)}
                aria-current={
                  isActive
                    ? "page"
                    : undefined
                }
                aria-label={`Go to page ${page}`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="saas-pagination-arrow"
          onClick={handleNext}
          disabled={safeCurrentPage === totalPages}
          aria-label="Next page"
        >
          <img
            src={arrowRightIcon}
            alt=""
          />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;