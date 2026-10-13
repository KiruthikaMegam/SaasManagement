import React from "react";

import "./FormTextarea.css";

function FormTextarea({
  label,
  name,
  value = "",
  onChange,
  placeholder = "",
  rows = 5,
  required = false,
  error = "",
  disabled = false,
  readOnly = false,
  maxLength,
  helperText = "",
  className = ""
}) {
  const inputId = `saas-textarea-${name}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const describedBy = error
    ? errorId
    : helperText
      ? helperId
      : undefined;

  return (
    <div className={`saas-form-textarea-group ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="saas-form-textarea-label"
        >
          <span>{label}</span>

          {required && (
            <b aria-hidden="true">
              *
            </b>
          )}
        </label>
      )}

      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={
          error
            ? "saas-form-textarea saas-form-textarea-error"
            : "saas-form-textarea"
        }
      />

      {error && (
        <span
          id={errorId}
          className="saas-form-textarea-error-text"
          role="alert"
        >
          {error}
        </span>
      )}

      {!error && helperText && (
        <span
          id={helperId}
          className="saas-form-textarea-helper"
        >
          {helperText}
        </span>
      )}
    </div>
  );
}

export default FormTextarea;