import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./PlanForm.css";

import { useSaaS } from "../context/SaaSContext";

import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
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

function PlanEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    plans = [],
    loading,
    error,
    updatePlan,
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
  const [planFound, setPlanFound] = useState(false);

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" }
  ];

  // Convert stored features into text for the textarea.
  const convertFeaturesToText = (features) => {
    if (Array.isArray(features)) {
      const featureLines = [];

      for (const feature of features) {
        if (feature !== null && feature !== undefined) {
          featureLines.push(String(feature));
        }
      }

      return featureLines.join("\n");
    }

    if (typeof features === "string") {
      return features;
    }

    return "";
  };

  // Load the selected plan.
  useEffect(() => {
    if (loading) {
      return;
    }

    let selectedPlan = null;

    for (const plan of plans) {
      if (String(plan.id) === String(id)) {
        selectedPlan = plan;
        break;
      }
    }

    if (!selectedPlan) {
      setPlanFound(false);
      return;
    }

    setFormData({
      name: selectedPlan.name || "",
      description: selectedPlan.description || "",

      monthlyPrice: selectedPlan.monthlyPrice ?? "",
      yearlyPrice: selectedPlan.yearlyPrice ?? "",

      userLimit:
        selectedPlan.userLimit === "Unlimited"
          ? ""
          : selectedPlan.userLimit ?? "",

      storageLimit:
        selectedPlan.storageLimit === "Unlimited"
          ? ""
          : selectedPlan.storageLimit ?? "",

      apiLimit:
        selectedPlan.apiLimit === "Unlimited"
          ? ""
          : selectedPlan.apiLimit ?? "",

      trialDays: selectedPlan.trialDays ?? 0,

      status: selectedPlan.status || "Active",

      popular: selectedPlan.popular === true,

      features: convertFeaturesToText(selectedPlan.features)
    });

    setErrors({});
    setPlanFound(true);
  }, [plans, id, loading]);

  // Handle changes in all form fields.
  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: ""
    }));
  };

  // Convert textarea content into a feature array.
  const convertFeaturesToArray = (featuresValue) => {
    const features = [];

    const featureLines = String(featuresValue || "").split("\n");

    for (const feature of featureLines) {
      const cleanedFeature = feature.trim();

      if (cleanedFeature !== "") {
        features.push(cleanedFeature);
      }
    }

    return features;
  };

  // Submit updated plan.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validatePlanForm(formData);

    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      showToast(
        "Please correct the highlighted fields.",
        "error"
      );

      return;
    }

    let existingPlan = null;

    for (const plan of plans) {
      if (String(plan.id) === String(id)) {
        existingPlan = plan;
        break;
      }
    }

    if (!existingPlan) {
      showToast("Plan not found. Please refresh and try again.", "error");
      navigate("/Plans");
      return;
    }

    const updatedPlan = {
      ...existingPlan,

      name: formData.name,
      description: formData.description,

      monthlyPrice: Number(formData.monthlyPrice),
      yearlyPrice: Number(formData.yearlyPrice),

      userLimit:
        formData.userLimit === ""
          ? "Unlimited"
          : Number(formData.userLimit),

      storageLimit:
        formData.storageLimit === ""
          ? "Unlimited"
          : formData.storageLimit,

      apiLimit:
        formData.apiLimit === ""
          ? "Unlimited"
          : Number(formData.apiLimit),

      trialDays: Number(formData.trialDays || 0),

      status: formData.status,
      popular: formData.popular,

      // Features are optional. An empty textarea saves [].
      features: convertFeaturesToArray(formData.features)
    };

    try {
  await updatePlan(id, updatedPlan);

  showToast("Plan updated successfully.", "success");

  navigate(`/Plans/${id}`);
} catch (updateError) {
  showToast(
    updateError.message || "Unable to update the plan.",
    "error"
  );
}
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load plan"
        message={error}
      />
    );
  }

  if (!planFound) {
    return (
      <div className="plan-form-page">
        <div className="plan-form-not-found">
          <div className="plan-form-not-found-icon">
            <img src={plansIcon} alt="Plan" />
          </div>

          <h2>Plan Not Found</h2>

          <p>
            The plan you are trying to edit does not exist
            or may have been removed.
          </p>

          <button
            type="button"
            onClick={() => navigate("/Plans")}
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-form-page">
      {/* HEADER */}
      <div className="plan-form-header">
        <div className="plan-form-title-wrapper">
          <div className="plan-form-title-icon">
            <img src={plansIcon} alt="Plans" />
          </div>

          <div>
            <h1>Edit Plan</h1>
            <p>Update the pricing and configuration of this plan.</p>
          </div>
        </div>
      </div>

      {/* FORM */}
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
              <p>Update the basic details of the plan.</p>
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
              error={errors.name || ""}
            />

            <FormTextarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter plan description"
              rows={4}
              required
              error={errors.description || ""}
            />
          </div>
        </div>

        {/* PRICING */}
        <div className="plan-form-section">
          <div className="plan-form-section-header">
            <div>
              <h2>Pricing</h2>
              <p>Update monthly and yearly pricing.</p>
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
              error={errors.monthlyPrice || ""}
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
              error={errors.yearlyPrice || ""}
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
              error={errors.trialDays || ""}
            />
          </div>
        </div>

        {/* PLAN LIMITS */}
        <div className="plan-form-section">
          <div className="plan-form-section-header">
            <div>
              <h2>Plan Limits</h2>
              <p>Update resource limits for this plan.</p>
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
              error={errors.userLimit || ""}
            />

            <FormInput
              label="Storage Limit"
              name="storageLimit"
              value={formData.storageLimit}
              onChange={handleChange}
              placeholder="Example: 100 GB"
              error={errors.storageLimit || ""}
            />

            <FormInput
              label="API Limit"
              name="apiLimit"
              type="number"
              value={formData.apiLimit}
              onChange={handleChange}
              placeholder="Example: 100000"
              min="1"
              error={errors.apiLimit || ""}
            />
          </div>
        </div>

        {/* PLAN SETTINGS */}
        <div className="plan-form-section">
          <div className="plan-form-section-header">
            <div>
              <h2>Plan Settings</h2>
              <p>Update status and plan visibility.</p>
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
              error={errors.status || ""}
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

                <span>Mark as Popular Plan</span>
              </label>

              <p>
                Highlight this plan as a recommended option
                for customers.
              </p>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="plan-form-section">
          <div className="plan-form-section-header">
            <div>
              <h2>Plan Features</h2>
              <p>Add one feature per line. This field is optional.</p>
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
            onClick={() => navigate(`/Plans/${id}`)}
          >
            <img src={closeIcon} alt="" />
            <span>Cancel</span>
          </button>

          <button
            type="submit"
            className="plan-form-save-button"
          >
            <img src={saveIcon} alt="" />
            <span>Update Plan</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlanEdit;