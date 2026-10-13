
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./CustomerForm.css";

import { useSaaS } from "../context/SaaSContext";

import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

import {
  validateEmail,
  validateName,
  validatePhone,
  validateRequired,
  validatePositiveNumber,
  hasValidationErrors,
} from "../utils/validation";

import customersIcon from "../assets/customers.png";
import saveIcon from "../assets/save.png";
import closeIcon from "../assets/close.png";

const initialFormData = {
  company: "",
  contactName: "",
  email: "",
  phone: "",
  country: "",
  plan: "",
  users: "",
  mrr: "",
  status: "Active",
  joinedDate: "",
};

function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    customers = [],
    updateCustomer,
    loading,
    error,
  } = useSaaS();

  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [formInitialized, setFormInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  // Prevent the form from reloading when customers state changes.
  const initializedCustomerId = useRef(null);

  const planOptions = [
    { value: "Free", label: "Free" },
    { value: "Starter", label: "Starter" },
    { value: "Professional", label: "Professional" },
    { value: "Business", label: "Business" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Trial", label: "Trial" },
  ];

  // Load the selected customer once for this ID.
  useEffect(() => {
    if (loading) {
      return;
    }

    const currentId = String(id);

    if (initializedCustomerId.current === currentId) {
      return;
    }

    const customer = customers.find(
      (item) => String(item.id) === currentId
    );

    if (!customer) {
      setFormData(null);
      setFormInitialized(true);
      initializedCustomerId.current = currentId;
      return;
    }

    setFormData({
      ...initialFormData,
      company: customer.company ?? "",
      contactName: customer.contactName ?? "",
      email: customer.email ?? "",
      phone: customer.phone ?? "",
      country: customer.country ?? "",
      plan: customer.plan ?? "",
      users: String(customer.users ?? ""),
      mrr: String(customer.mrr ?? ""),
      status: customer.status ?? "Active",
      joinedDate: customer.joinedDate ?? "",
    });

    setErrors({});
    setFormInitialized(true);
    initializedCustomerId.current = currentId;
  }, [customers, id, loading]);

  // Handle input changes.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => {
      if (!previousData) {
        return previousData;
      }

      return {
        ...previousData,
        [name]: value,
      };
    });

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
      form: "",
    }));
  };

  // Validate the form.
  const validateForm = () => {
    if (!formData) {
      return false;
    }

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
      validationErrors.users = "Users must be greater than 0.";
    }

    if (!validatePositiveNumber(formData.mrr)) {
      validationErrors.mrr =
        "Please enter a valid non-negative MRR value.";
    }

    if (!validateRequired(formData.status)) {
      validationErrors.status = "Please select a status.";
    }

    if (!validateRequired(formData.joinedDate)) {
      validationErrors.joinedDate = "Joined date is required.";
    }

    setErrors(validationErrors);

    return !hasValidationErrors(validationErrors);
  };

  // Save updated customer details.
  const handleSubmit = (event) => {
    event.preventDefault();

    if (saving || !validateForm()) {
      return;
    }

    const updatedCustomer = {
      company: formData.company,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      plan: formData.plan,
      users: Number(formData.users),
      mrr: Number(formData.mrr),
      status: formData.status,
      joinedDate: formData.joinedDate,
    };

    setSaving(true);

    try {
      const success = updateCustomer(id, updatedCustomer);

      if (success) {
        navigate(`/Customers/${id}`);
      } else {
        setErrors((previousErrors) => ({
          ...previousErrors,
          form: "Unable to update customer. Please try again.",
        }));
      }
    } catch {
      setErrors((previousErrors) => ({
        ...previousErrors,
        form: "Something went wrong while updating the customer.",
      }));
    } finally {
      setSaving(false);
    }
  };

  // Loading state.
  if (loading || !formInitialized) {
    return (
      <div className="customer-form-page">
        <Loader />
      </div>
    );
  }

  // Error state.
  if (error) {
    return (
      <div className="customer-form-page">
        <ErrorState
          title="Unable to load customer"
          message={error}
        />
      </div>
    );
  }

  // Customer not found.
  if (!formData) {
    return (
      <div className="customer-form-page">
        <ErrorState
          title="Customer not found"
          message={`No customer was found for ID ${id}. Please return to the customers list.`}
        />

        <button
          type="button"
          className="customer-form-primary-button"
          onClick={() => navigate("/Customers")}
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="customer-form-page">
      <div className="customer-form-header">
        <div className="customer-form-title">
          <div className="customer-form-title-icon">
            <img src={customersIcon} alt="" />
          </div>

          <div>
            <h1>Edit Customer</h1>
            <p>Update customer account information.</p>
          </div>
        </div>
      </div>

      <form
        className="customer-form-card"
        onSubmit={handleSubmit}
        noValidate
      >
        {errors.form && (
          <p className="customer-form-error">{errors.form}</p>
        )}

        <div className="customer-form-section">
          <div className="customer-form-section-title">
            <h2>Customer Information</h2>
            <p>Update the customer's contact information.</p>
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
            <p>Update the customer's plan and account details.</p>
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
            onClick={() => navigate(`/Customers/${id}`)}
            disabled={saving}
          >
            <img src={closeIcon} alt="" />
            Cancel
          </button>

          <button
            type="submit"
            className="customer-form-primary-button"
            disabled={saving}
          >
            <img src={saveIcon} alt="" />
            {saving ? "Updating..." : "Update Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerEdit;