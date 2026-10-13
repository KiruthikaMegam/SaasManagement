import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CustomerForm.css";

import { useSaaS } from "../context/SaaSContext";

import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

import {
  validateEmail,
  validateName,
  validatePhone,
  validateRequired,
  validatePositiveNumber,
  hasValidationErrors
} from "../utils/validation";

import customersIcon from "../assets/customers.png";
import saveIcon from "../assets/save.png";
import closeIcon from "../assets/close.png";

function CustomerAdd() {
  const navigate = useNavigate();

  const { addCustomer } = useSaaS();

  const [formData, setFormData] = useState({
    company: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    plan: "",
    users: "1",
    mrr: "",
    status: "Active",
    joinedDate: new Date().toISOString().split("T")[0]
  });

  const [errors, setErrors] = useState({});

  const planOptions = [
    {
      value: "Free",
      label: "Free"
    },
    {
      value: "Starter",
      label: "Starter"
    },
    {
      value: "Professional",
      label: "Professional"
    },
    {
      value: "Business",
      label: "Business"
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
    },
    {
      value: "Trial",
      label: "Trial"
    }
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

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
    const validationErrors = {};

    if (!validateRequired(formData.company)) {
      validationErrors.company = "Company name is required.";
    }

    if (!validateName(formData.contactName)) {
      validationErrors.contactName =
        "Please enter a valid contact name.";
    }

    if (!validateEmail(formData.email)) {
      validationErrors.email =
        "Please enter a valid email address.";
    }

    if (!validatePhone(formData.phone)) {
      validationErrors.phone =
        "Please enter a valid phone number.";
    }

    if (!validateRequired(formData.country)) {
      validationErrors.country = "Country is required.";
    }

    if (!validateRequired(formData.plan)) {
      validationErrors.plan = "Please select a plan.";
    }

    if (!validatePositiveNumber(formData.users)) {
      validationErrors.users =
        "Users must be greater than 0.";
    }

    if (!validatePositiveNumber(formData.mrr)) {
      validationErrors.mrr =
        "MRR must be greater than 0.";
    }

    if (!validateRequired(formData.status)) {
      validationErrors.status = "Please select a status.";
    }

    if (!validateRequired(formData.joinedDate)) {
      validationErrors.joinedDate =
        "Joined date is required.";
    }

    setErrors(validationErrors);

    return !hasValidationErrors(validationErrors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    addCustomer({
      ...formData,
      users: Number(formData.users),
      mrr: Number(formData.mrr)
    });

    navigate("/Customers");
  };

  return (
    <div className="customer-form-page">
      <div className="customer-form-header">
        <div className="customer-form-title">
          <div className="customer-form-title-icon">
            <img src={customersIcon} alt="" />
          </div>

          <div>
            <h1>Add Customer</h1>
            <p>Create a new customer account.</p>
          </div>
        </div>

        {/* <button
          type="button"
          className="customer-form-close-button"
          onClick={() => navigate("/Customers")}
        >
          <img src={closeIcon} alt="" />
          <span>Cancel</span>
        </button> */}
      </div>

      <form
        className="customer-form-card"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="customer-form-section">
          <div className="customer-form-section-title">
            <h2>Customer Information</h2>
            <p>
              Enter the customer's basic contact information.
            </p>
          </div>

          <div className="customer-form-fields">
            <FormInput
              label="Company Name"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              error={errors.company}
              required
            />

            <FormInput
              label="Contact Name"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Enter contact name"
              error={errors.contactName}
              required
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              error={errors.email}
              required
            />

            <FormInput
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              error={errors.phone}
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

        <div className="customer-form-section">
          <div className="customer-form-section-title">
            <h2>Subscription Information</h2>
            <p>
              Configure the customer's current plan and account details.
            </p>
          </div>

          <div className="customer-form-fields">
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

            <FormInput
              label="Users"
              name="users"
              type="number"
              min="1"
              value={formData.users}
              onChange={handleChange}
              placeholder="Enter number of users"
              error={errors.users}
              required
            />

            <FormInput
              label="Monthly Recurring Revenue"
              name="mrr"
              type="number"
              min="0"
              step="0.01"
              value={formData.mrr}
              onChange={handleChange}
              placeholder="Enter MRR"
              error={errors.mrr}
              required
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              placeholder="Select status"
              error={errors.status}
              required
            />

            <FormInput
              label="Joined Date"
              name="joinedDate"
              type="date"
              value={formData.joinedDate}
              onChange={handleChange}
              error={errors.joinedDate}
              required
            />
          </div>
        </div>

        <div className="customer-form-actions">
          <button
            type="button"
            className="customer-form-secondary-button"
            onClick={() => navigate("/Customers")}
          >
            <img src={closeIcon} alt="" />
            Cancel
          </button>

          <button
            type="submit"
            className="customer-form-primary-button"
          >
            <img src={saveIcon} alt="" />
            Save Customer
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerAdd;