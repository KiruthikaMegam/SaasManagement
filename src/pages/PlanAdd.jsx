import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PlanForm.css";

import { useSaaS } from "../context/SaaSContext";

import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import FormTextarea from "../components/FormTextarea";

import {
  validatePlanForm,
  hasValidationErrors
} from "../utils/validation";

import plansIcon from "../assets/plans.png";
import saveIcon from "../assets/save.png";
import closeIcon from "../assets/close.png";

function PlanAdd() {
  const navigate = useNavigate();

  const {
    addPlan,
    showToast
  } = useSaaS();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    monthlyPrice: "",
    yearlyPrice: "",
    userLimit: "",
    storageLimit: "",
    apiLimit: "",
    trialDays: "14",
    status: "Active",
    popular: false,
    features: ""
  });

  const [errors, setErrors] = useState({});

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

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: ""
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors =
      validatePlanForm(formData);

    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      showToast(
        "Please correct the highlighted fields.",
        "error"
      );

      return;
    }

const features = [];

if (Array.isArray(formData.features)) {
  for (const feature of formData.features) {
    if (String(feature).replace(/\s/g, "") !== "") {
      features.push(String(feature).trim());
    }
  }
} else {
  const featureLines = String(formData.features || "").split("\n");

  for (const feature of featureLines) {
    if (feature.replace(/\s/g, "") !== "") {
      features.push(feature.trim());
    }
  }
}


    const planData = {
      name: formData.name,
      description: formData.description,

      monthlyPrice: Number(
        formData.monthlyPrice
      ),

      yearlyPrice: Number(
        formData.yearlyPrice
      ),

      userLimit:
        formData.userLimit === ""
          ? "Unlimited"
          : formData.userLimit,

      storageLimit:
        formData.storageLimit === ""
          ? "Unlimited"
          : formData.storageLimit,

      apiLimit:
        formData.apiLimit === ""
          ? "Unlimited"
          : formData.apiLimit,

      trialDays: Number(
        formData.trialDays || 0
      ),

      status: formData.status,
      popular: formData.popular,
      features,
      subscribers: 0
    };

    try {
      await addPlan(planData);

      showToast(
        "Plan created successfully.",
        "success"
      );

      navigate("/Plans");
    } catch (submitError) {
      showToast(
        "Unable to create the plan.",
        "error"
      );
    }
  };

  return (
    <div className="plan-form-page">

      <div className="plan-form-header">

        <div className="plan-form-title-wrapper">

          <div className="plan-form-title-icon">
            <img
              src={plansIcon}
              alt="Plans"
            />
          </div>

          <div>
            <h1>Add Plan</h1>

            <p>
              Create a new pricing plan for your
              customers.
            </p>
          </div>

        </div>

      </div>

      <form
        className="plan-form-card"
        onSubmit={handleSubmit}
        noValidate
      >

        {/* BASIC INFORMATION */}

        <div className="plan-form-section">

          <div className="plan-form-section-header">

            <div>
              <h2>Basic Information</h2>

              <p>
                Enter the basic details of the plan.
              </p>
            </div>

          </div>

          <div className="plan-form-fields">

            <FormInput
              label="Plan Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter plan name"
              required
              error={errors.name}
            />

            <FormTextarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter plan description"
              rows="4"
              required
              error={errors.description}
            />

          </div>

        </div>

        {/* PRICING */}

        <div className="plan-form-section">

          <div className="plan-form-section-header">

            <div>
              <h2>Pricing</h2>

              <p>
                Configure monthly and yearly pricing.
              </p>
            </div>

          </div>

          <div className="plan-form-fields">

            <FormInput
              label="Monthly Price"
              name="monthlyPrice"
              type="number"
              value={formData.monthlyPrice}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              required
              error={errors.monthlyPrice}
            />

            <FormInput
              label="Yearly Price"
              name="yearlyPrice"
              type="number"
              value={formData.yearlyPrice}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              required
              error={errors.yearlyPrice}
            />

            <FormInput
              label="Trial Period"
              name="trialDays"
              type="number"
              value={formData.trialDays}
              onChange={handleChange}
              placeholder="14"
              min="0"
              required
              error={errors.trialDays}
            />

          </div>

        </div>

        {/* PLAN LIMITS */}

        <div className="plan-form-section">

          <div className="plan-form-section-header">

            <div>
              <h2>Plan Limits</h2>

              <p>
                Configure resource limits for this
                plan.
              </p>
            </div>

          </div>

          <div className="plan-form-fields">

            <FormInput
              label="User Limit"
              name="userLimit"
              type="number"
              value={formData.userLimit}
              onChange={handleChange}
              placeholder="Leave empty for unlimited"
              min="1"
              error={errors.userLimit}
            />

            <FormInput
              label="Storage Limit"
              name="storageLimit"
              value={formData.storageLimit}
              onChange={handleChange}
              placeholder="Example: 100 GB"
              error={errors.storageLimit}
            />

            <FormInput
              label="API Limit"
              name="apiLimit"
              type="number"
              value={formData.apiLimit}
              onChange={handleChange}
              placeholder="Example: 100000"
              min="1"
              error={errors.apiLimit}
            />

          </div>

        </div>

        {/* PLAN SETTINGS */}

        <div className="plan-form-section">

          <div className="plan-form-section-header">

            <div>
              <h2>Plan Settings</h2>

              <p>
                Configure status and plan visibility.
              </p>
            </div>

          </div>

          <div className="plan-form-fields">

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              required
              error={errors.status}
            />

            <div className="plan-form-checkbox-wrapper">

              <label
                className="plan-form-checkbox-label"
                htmlFor="popular"
              >
                <input
                  id="popular"
                  type="checkbox"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleChange}
                />

                <span>
                  Mark as Popular Plan
                </span>
              </label>

              <p>
                Highlight this plan as a recommended
                option for customers.
              </p>

            </div>

          </div>

        </div>

        {/* FEATURES */}

        <div className="plan-form-section">

          <div className="plan-form-section-header">

            <div>
              <h2>Plan Features</h2>

              <p>
                Add one feature per line.
              </p>
            </div>

          </div>

          <FormTextarea
  label="Features"
  name="features"
  value={formData.features}
  onChange={handleChange}
  placeholder={"Unlimited projects\nAdvanced analytics\nPriority support"}
  rows={6}
  error={errors.features || ""}
/>

        </div>

        {/* ACTIONS */}

        <div className="plan-form-actions">

          <button
            type="button"
            className="plan-form-cancel-button"
            onClick={() => navigate("/Plans")}
          >
            <img
              src={closeIcon}
              alt=""
            />

            <span>Cancel</span>
          </button>

          <button
            type="submit"
            className="plan-form-save-button"
          >
            <img
              src={saveIcon}
              alt=""
            />

            <span>Save Plan</span>
          </button>

        </div>

      </form>

    </div>
  );
}

export default PlanAdd;