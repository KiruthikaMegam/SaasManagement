import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SubscriptionForm.css";

import { useSaaS } from "../context/SaaSContext";

import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

import subscriptionsIcon from "../assets/subscriptions.png";
import saveIcon from "../assets/save.png";
import closeIcon from "../assets/close.png";

import {
  validateSubscriptionForm,
  hasValidationErrors
} from "../utils/validation";

function SubscriptionAdd() {
  const navigate = useNavigate();

  const {
    customers = [],
    plans = [],
    addSubscription,
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
          customer: selectedCustomer.company || "",
          plan: selectedCustomer.plan || previous.plan,
          amount:
            selectedCustomer.mrr !== undefined &&
            selectedCustomer.mrr !== null
              ? String(selectedCustomer.mrr)
              : previous.amount
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

    if (name === "billingCycle" && formData.plan) {
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

    const validationErrors =
      validateSubscriptionForm(formData);

    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      showToast(
        "Please correct the highlighted fields.",
        "error"
      );

      return;
    }

    const subscription = {
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

    addSubscription(subscription);

    showToast(
      "Subscription added successfully.",
      "success"
    );

    navigate("/Subscriptions");
  };

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
              Add Subscription
            </h1>

            <p>
              Create a new customer subscription.
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
              Select the customer and pricing plan
              for this subscription.
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
              Configure billing cycle and subscription
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
              Set the current status and payment status.
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
              Set the subscription start and renewal
              dates.
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
              navigate("/Subscriptions")
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
              Save Subscription
            </span>
          </button>

        </div>

      </form>

    </div>
  );
}

export default SubscriptionAdd;