import React from "react";

import "./FormInput.css";

function FormInput({
  label,
  name,
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  error = "",
  required = false,
  disabled = false,
  readOnly = false,
  min,
  max,
  step,
  maxLength,
  helperText = ""
}) {
  const inputId = `saas-form-${name}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const describedBy = error
    ? errorId
    : helperText
      ? helperId
      : undefined;

  return (
    <div className="saas-form-group">
      <label htmlFor={inputId}>
        <span>{label}</span>

        {required && (
          <b aria-hidden="true">
            *
          </b>
        )}
      </label>

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        required={required}
        aria-invalid={error !== ""}
        aria-describedby={describedBy}
        className={
          error
            ? "saas-form-input saas-form-input-error"
            : "saas-form-input"
        }
      />

      {error && (
        <span
          id={errorId}
          className="saas-form-error"
          role="alert"
        >
          {error}
        </span>
      )}

      {!error && helperText && (
        <span
          id={helperId}
          className="saas-form-helper"
        >
          {helperText}
        </span>
      )}
    </div>
  );
}

export default FormInput;