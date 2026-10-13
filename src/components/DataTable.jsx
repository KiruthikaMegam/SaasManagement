import React from "react";

import viewIcon from "../assets/view.png";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";

import "./DataTable.css";

function DataTable({
  columns = [],
  data = [],
  onView,
  onEdit,
  onDelete,
  emptyMessage = "No records found"
}) {
  const hasActions =
    typeof onView === "function" ||
    typeof onEdit === "function" ||
    typeof onDelete === "function";

  return (
    <div className="saas-table-wrapper">
      <div className="saas-table-scroll">
        <table className="saas-data-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${column.key || column.title}-${index}`}
                >
                  {column.title}
                </th>
              ))}

              {hasActions && (
                <th className="saas-table-actions-heading">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={
                    row.id !== undefined
                      ? row.id
                      : `row-${rowIndex}`
                  }
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={`${column.key || column.title}-${columnIndex}`}
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}

                  {hasActions && (
                    <td className="saas-table-actions">
                      {onView && (
                        <button
                          type="button"
                          className="saas-table-action saas-table-view"
                          onClick={() => onView(row)}
                          aria-label="View"
                        >
                          <img
                            src={viewIcon}
                            alt="View"
                          />
                        </button>
                      )}

                      {onEdit && (
                        <button
                          type="button"
                          className="saas-table-action saas-table-edit"
                          onClick={() => onEdit(row)}
                          aria-label="Edit"
                        >
                          <img
                            src={editIcon}
                            alt="Edit"
                          />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          type="button"
                          className="saas-table-action saas-table-delete"
                          onClick={() => onDelete(row)}
                          aria-label="Delete"
                        >
                          <img
                            src={deleteIcon}
                            alt="Delete"
                          />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length + (hasActions ? 1 : 0)
                  }
                  className="saas-table-empty"
                >
                  <div className="saas-table-empty-content">
                    <span className="saas-table-empty-circle">
                      —
                    </span>

                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;