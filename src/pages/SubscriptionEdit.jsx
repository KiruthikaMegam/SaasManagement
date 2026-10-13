import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./SubscriptionForm.css";

import { useSaaS } from "../context/SaaSContext";

import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

import subscriptionsIcon from "../assets/subscriptions.png";
import saveIcon from "../assets/save.png";
import closeIcon from "../assets/close.png";

import {
  validateSubscriptionForm,
  hasValidationErrors
} from "../utils/validation";

function SubscriptionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    subscriptions = [],
    customers = [],
    plans = [],
    loading,
    error,
    updateSubscription,
    showToast
  } = useSaaS();

  const [formData, setFormData] = useState({
    customerId: "",
    customer: "",
    plan: "",
    billingCycle: "Monthly",
    amount: "",
    status: "Active",
    startDate: "",
    renewalDate: "",
    paymentStatus: "Paid"
  });

  const [errors, setErrors] = useState({});
  const [subscriptionFound, setSubscriptionFound] =
    useState(false);

 
useEffect(() => {
  if (loading) {
    return;
  }

  let selectedSubscription = null;

  for (const subscription of subscriptions) {
    if (String(subscription.id) === String(id)) {
      selectedSubscription = subscription;
      break;
    }
  }

  if (!selectedSubscription) {
    setSubscriptionFound(false);
    return;
  }

  setSubscriptionFound(true);

  setFormData({
    customerId:
      selectedSubscription.customerId != null
        ? String(selectedSubscription.customerId)
        : "",
    customer: selectedSubscription.customer || "",
    plan: selectedSubscription.plan || "",
    billingCycle: selectedSubscription.billingCycle || "Monthly",
    amount:
      selectedSubscription.amount != null
        ? String(selectedSubscription.amount)
        : "",
    status: selectedSubscription.status || "Active",
    startDate: selectedSubscription.startDate || "",
    renewalDate: selectedSubscription.renewalDate || "",
    paymentStatus: selectedSubscription.paymentStatus || "Paid"
  });
}, [id, loading]);

  const customerOptions = useMemo(() => {
    const options = [];

    for (const customer of customers) {
      options.push({
        value: String(customer.id),
        label: customer.company
          ? customer.company
          : customer.contactName || `Customer ${customer.id}`
      });
    }

    return options;
  }, [customers]);

  const planOptions = useMemo(() => {
    const options = [];

    for (const plan of plans) {
      options.push({
        value: plan.name,
        label: plan.name
      });
    }

    return options;
  }, [plans]);

  const billingOptions = [
    {
      value: "Monthly",
      label: "Monthly"
    },
    {
      value: "Yearly",
      label: "Yearly"
    }
  ];

  const statusOptions = [
    {
      value: "Active",
      label: "Active"
    },
    {
      value: "Trial",
      label: "Trial"
    },
    {
      value: "Expired",
      label: "Expired"
    },
    {
      value: "Past Due",
      label: "Past Due"
    }
  ];

  const paymentOptions = [
    {
      value: "Paid",
      label: "Paid"
    },
    {
      value: "Pending",
      label: "Pending"
    },
    {
      value: "Failed",
      label: "Failed"
    },
    {
      value: "Not Required",
      label: "Not Required"
    }
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: ""
      }));
    }

    if (name === "customerId") {
      let selectedCustomer = null;

      for (const customer of customers) {
        if (String(customer.id) === String(value)) {
          selectedCustomer = customer;
          break;
        }
      }

      if (selectedCustomer) {
        setFormData((previous) => ({
          ...previous,
          customerId: String(selectedCustomer.id),
          customer:
            selectedCustomer.company || "",
          plan:
            previous.plan ||
            selectedCustomer.plan ||
            "",
          amount:
            previous.amount ||
            (
              selectedCustomer.mrr !== undefined &&
              selectedCustomer.mrr !== null
                ? String(selectedCustomer.mrr)
                : ""
            )
        }));
      }
    }

    if (name === "plan") {
      let selectedPlan = null;

      for (const plan of plans) {
        if (plan.name === value) {
          selectedPlan = plan;
          break;
        }
      }

      if (selectedPlan) {
        const amount =
          formData.billingCycle === "Yearly"
            ? selectedPlan.yearlyPrice
            : selectedPlan.monthlyPrice;

        setFormData((previous) => ({
          ...previous,
          plan: selectedPlan.name,
          amount:
            amount !== undefined &&
            amount !== null
              ? String(amount)
              : previous.amount
        }));
      }
    }

    if (
      name === "billingCycle" &&
      formData.plan
    ) {
      let selectedPlan = null;

      for (const plan of plans) {
        if (plan.name === formData.plan) {
          selectedPlan = plan;
          break;
        }
      }

      if (selectedPlan) {
        const amount =
          value === "Yearly"
            ? selectedPlan.yearlyPrice
            : selectedPlan.monthlyPrice;

        setFormData((previous) => ({
          ...previous,
          billingCycle: value,
          amount:
            amount !== undefined &&
            amount !== null
              ? String(amount)
              : previous.amount
        }));
      }
    }
  };



const handleSubmit = (event) => {
  event.preventDefault();

  console.log("Update button clicked");
  console.log("Form data:", formData);
  console.log("Subscription ID:", id);

  const validationErrors = validateSubscriptionForm(formData);

  setErrors(validationErrors);

  if (hasValidationErrors(validationErrors)) {
    showToast("Please correct the highlighted fields.", "error");
    console.log("Validation errors:", validationErrors);
    return;
  }

  const updatedSubscription = {
    customerId: formData.customerId,
    customer: formData.customer,
    plan: formData.plan,
    billingCycle: formData.billingCycle,
    amount: Number(formData.amount),
    status: formData.status,
    startDate: formData.startDate,
    renewalDate: formData.renewalDate,
    paymentStatus: formData.paymentStatus
  };

  try {
    const result = updateSubscription(id, updatedSubscription);

    console.log("Update result:", result);

    if (result === false) {
      return;
    }

    navigate(`/Subscriptions/${id}`);
  } catch (updateError) {
    console.error("Subscription update failed:", updateError);
    showToast("Failed to update subscription.", "error");
  }
};


  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="subscription-form-page">
        <ErrorState message={error} />
      </div>
    );
  }

  if (!subscriptionFound) {
    return (
      <div className="subscription-form-page">
        <div className="subscription-not-found">
          <div className="subscription-not-found-icon">
            <img
              src={subscriptionsIcon}
              alt=""
            />
          </div>

          <h2>
            Subscription Not Found
          </h2>

          <p>
            The subscription you are trying to
            edit does not exist.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/Subscriptions")
            }
          >
            Back to Subscriptions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-form-page">

      <div className="subscription-form-header">

        <div className="subscription-form-title">

          <div className="subscription-form-icon">
            <img
              src={subscriptionsIcon}
              alt=""
            />
          </div>

          <div>
            <span className="page-label">
              SUBSCRIPTION MANAGEMENT
            </span>

            <h1>
              Edit Subscription
            </h1>

            <p>
              Update subscription and billing
              information.
            </p>
          </div>

        </div>

      </div>

      <form
        className="subscription-form-card"
        onSubmit={handleSubmit}
        noValidate
      >

        <div className="subscription-form-section">

          <div className="subscription-section-heading">
            <h2>
              Customer & Plan
            </h2>

            <p>
              Update the customer and pricing plan.
            </p>
          </div>

          <div className="subscription-form-fields">

            <FormSelect
              label="Customer"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              options={customerOptions}
              placeholder="Select customer"
              error={errors.customerId}
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

          </div>

        </div>

        <div className="subscription-form-section">

          <div className="subscription-section-heading">
            <h2>
              Billing Details
            </h2>

            <p>
              Update billing cycle and subscription
              amount.
            </p>
          </div>

          <div className="subscription-form-fields">

            <FormSelect
              label="Billing Cycle"
              name="billingCycle"
              value={formData.billingCycle}
              onChange={handleChange}
              options={billingOptions}
              error={errors.billingCycle}
              required
            />

            <FormInput
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              error={errors.amount}
              required
            />

          </div>

        </div>

        <div className="subscription-form-section">

          <div className="subscription-section-heading">
            <h2>
              Subscription Status
            </h2>

            <p>
              Update subscription and payment status.
            </p>
          </div>

          <div className="subscription-form-fields">

            <FormSelect
              label="Subscription Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              error={errors.status}
              required
            />

            <FormSelect
              label="Payment Status"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              options={paymentOptions}
              error={errors.paymentStatus}
              required
            />

          </div>

        </div>

        <div className="subscription-form-section">

          <div className="subscription-section-heading">
            <h2>
              Subscription Dates
            </h2>

            <p>
              Update the start and renewal dates.
            </p>
          </div>

          <div className="subscription-form-fields">

            <FormInput
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />

            <FormInput
              label="Renewal Date"
              name="renewalDate"
              type="date"
              value={formData.renewalDate}
              onChange={handleChange}
              error={errors.renewalDate}
              required
            />

          </div>

        </div>

        <div className="subscription-form-actions">

          <button
            type="button"
            className="secondary-form-button"
            onClick={() =>
              navigate(`/Subscriptions/${id}`)
            }
          >
            <img
              src={closeIcon}
              alt=""
            />

            <span>
              Cancel
            </span>
          </button>

          <button
            type="submit"
            className="primary-form-button"
          >
            <img
              src={saveIcon}
              alt=""
            />

            <span>
              Update Subscription
            </span>
          </button>

        </div>

      </form>

    </div>
  );
}

export default SubscriptionEdit;