import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSaaS } from "../context/SaaSContext";

import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

import {
  validateEmail,
  validateName,
  validateRequired,
  hasValidationErrors
} from "../utils/validation";

import "./UserForm.css";

import userIcon from "../assets/users.png";
import saveIcon from "../assets/save.png";
import closeIcon from "../assets/close.png";

function UserAdd() {
  const navigate = useNavigate();

  const {
    addUser,
    plans = []
  } = useSaaS();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    plan: "",
    status: "Active",
    country: "",
    lastLogin: "",
    createdAt: new Date().toISOString().split("T")[0],
    avatar: ""
  });

  const [errors, setErrors] = useState({});

  const roleOptions = [
    {
      value: "Administrator",
      label: "Administrator"
    },
    {
      value: "Manager",
      label: "Manager"
    },
    {
      value: "User",
      label: "User"
    },
    {
      value: "Viewer",
      label: "Viewer"
    }
  ];

  const statusOptions = [
    {
      value: "Active",
      label: "Active"
    },
    {
      value: "Inactive",
      label: "Inactive"
    }
  ];

  const planOptions = [];

  for (const plan of plans) {
    planOptions.push({
      value: plan.name,
      label: plan.name
    });
  }

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = "Name is required.";
    } else if (!validateName(formData.name)) {
      newErrors.name =
        "Please enter a valid name.";
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!validateRequired(formData.company)) {
      newErrors.company =
        "Company name is required.";
    }

    if (!validateRequired(formData.role)) {
      newErrors.role = "Role is required.";
    }

    if (!validateRequired(formData.plan)) {
      newErrors.plan = "Please select a plan.";
    }

    if (!validateRequired(formData.country)) {
      newErrors.country =
        "Country is required.";
    }

    setErrors(newErrors);

    return !hasValidationErrors(newErrors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    addUser(formData);

    navigate("/Users");
  };

  const handleCancel = () => {
    navigate("/Users");
  };

  return (
    <section className="saas-user-form-page">
      <div className="saas-user-form-header">
        <div className="saas-user-form-title">
          <div className="saas-user-form-title-icon">
            <img
              src={userIcon}
              alt=""
            />
          </div>

          <div>
            <h1>Add User</h1>
            <p>
              Create a new user account and assign
              a plan.
            </p>
          </div>
        </div>
      </div>

      <form
        className="saas-user-form-card"
        onSubmit={handleSubmit}
      >
        <div className="saas-user-form-section">
          <div className="saas-user-form-section-heading">
            <h2>Basic Information</h2>
            <p>
              Enter the user's personal and company
              information.
            </p>
          </div>

          <div className="saas-user-form-fields">
            <FormInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              error={errors.name}
              required
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              error={errors.email}
              required
            />

            <FormInput
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              error={errors.company}
              required
            />

            <FormInput
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
              error={errors.country}
              required
            />
          </div>
        </div>

        <div className="saas-user-form-section">
          <div className="saas-user-form-section-heading">
            <h2>Account Settings</h2>
            <p>
              Configure the user's role, plan and
              account status.
            </p>
          </div>

          <div className="saas-user-form-fields">
            <FormSelect
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={roleOptions}
              placeholder="Select role"
              error={errors.role}
              required
            />

            <FormSelect
              label="Plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              options={planOptions}
              placeholder="Select plan"
              error={errors.plan}
              required
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              required
            />

            <FormInput
              label="Last Login"
              name="lastLogin"
              type="date"
              value={formData.lastLogin}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="saas-user-form-section">
          <div className="saas-user-form-section-heading">
            <h2>Profile Image</h2>
            <p>
              Add an optional profile image URL.
            </p>
          </div>

          <div className="saas-user-form-single-field">
            <FormInput
              label="Avatar URL"
              name="avatar"
              type="url"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              helperText="Optional"
            />
          </div>
        </div>

        <div className="saas-user-form-footer">
          <button
            type="button"
            className="saas-user-form-cancel"
            onClick={handleCancel}
          >
            <img
              src={closeIcon}
              alt=""
            />
            Cancel
          </button>

          <button
            type="submit"
            className="saas-user-form-save"
          >
            <img
              src={saveIcon}
              alt=""
            />
            Save User
          </button>
        </div>
      </form>
    </section>
  );
}

export default UserAdd;