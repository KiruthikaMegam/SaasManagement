import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSaaS } from "../context/SaaSContext";

import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

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

function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    users = [],
    plans = [],
    updateUser,
    loading,
    error
  } = useSaaS();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    plan: "",
    status: "Active",
    country: "",
    lastLogin: "",
    createdAt: "",
    avatar: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    let selectedUser = null;

    for (const item of users) {
      if (String(item.id) === String(id)) {
        selectedUser = item;
        break;
      }
    }

    if (selectedUser) {
      setUser(selectedUser);

      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        company: selectedUser.company || "",
        role: selectedUser.role || "",
        plan: selectedUser.plan || "",
        status: selectedUser.status || "Active",
        country: selectedUser.country || "",
        lastLogin: selectedUser.lastLogin || "",
        createdAt: selectedUser.createdAt || "",
        avatar: selectedUser.avatar || ""
      });
    }
  }, [users, id]);

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

    updateUser(user.id, formData);

    navigate(`/Users/${user.id}`);
  };

  const handleCancel = () => {
    navigate(`/Users/${id}`);
  };

  if (loading) {
    return (
      <div className="saas-user-form-state">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="saas-user-form-state">
        <ErrorState
          title="Unable to load user"
          message={error}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="saas-user-form-state">
        <ErrorState
          title="User not found"
          message="The user you are trying to edit does not exist."
        />

        <button
          type="button"
          className="saas-user-form-back"
          onClick={() => navigate("/Users")}
        >
          Back to Users
        </button>
      </div>
    );
  }

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
            <h1>Edit User</h1>
            <p>
              Update account information and user
              settings.
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
              Update the user's personal and company
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
              Update the user's role, plan and
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
              Update the user's profile image URL.
            </p>
          </div>

          <div className="saas-user-form-single-field">
            
<FormInput
  label="Avatar URL"
  name="avatar"
  type="text"
  value={formData.avatar}
  onChange={handleChange}
  placeholder="https://example.com/avatar.jpg"
  helperText="Optional. You can use a full URL or a local path such as /assets/profile.png."
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
            Update User
          </button>
        </div>
      </form>
    </section>
  );
}

export default UserEdit;