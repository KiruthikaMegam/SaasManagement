import React from "react";

import "./FormSelect.css";

function FormSelect({
  label,
  name,
  value = "",
  onChange,
  options = [],
  placeholder = "Select an option",
  error = "",
  required = false,
  disabled = false,
  helperText = ""
}) {
  const inputId = `saas-select-${name}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const describedBy = error
    ? errorId
    : helperText
      ? helperId
      : undefined;

  return (
    <div className="saas-form-select-group">
      <label htmlFor={inputId}>
        <span>{label}</span>

        {required && (
          <b aria-hidden="true">
            *
          </b>
        )}
      </label>

      <select
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={error !== ""}
        aria-describedby={describedBy}
        className={
          error
            ? "saas-form-select saas-form-select-error"
            : "saas-form-select"
        }
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span
          id={errorId}
          className="saas-form-select-error-text"
          role="alert"
        >
          {error}
        </span>
      )}

      {!error && helperText && (
        <span
          id={helperId}
          className="saas-form-select-helper"
        >
          {helperText}
        </span>
      )}
    </div>
  );
}

export default FormSelect;