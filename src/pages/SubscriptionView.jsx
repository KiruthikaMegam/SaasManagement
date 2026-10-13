import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./SubscriptionView.css";

import { useSaaS } from "../context/SaaSContext";

import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";

import subscriptionsIcon from "../assets/subscriptions.png";
import customersIcon from "../assets/customers.png";
import plansIcon from "../assets/plans.png";
import arrowLeftIcon from "../assets/arrow-left.png";
import editIcon from "../assets/edit.png";

function SubscriptionView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    subscriptions = [],
    loading,
    error
  } = useSaaS();

  const subscription = useMemo(() => {
    let selectedSubscription = null;

    for (const item of subscriptions) {
      if (String(item.id) === String(id)) {
        selectedSubscription = item;
        break;
      }
    }

    return selectedSubscription;
  }, [subscriptions, id]);

  if (loading) {
    return (
      <div className="subscription-view-page">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscription-view-page">
        <ErrorState message={error} />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="subscription-view-page">
        <div className="subscription-not-found">
          <div className="subscription-not-found-icon">
            <img src={subscriptionsIcon} alt="" />
          </div>

          <h2>Subscription Not Found</h2>

          <p>
            The subscription you are looking for
            does not exist or may have been removed.
          </p>

          <button
            type="button"
            onClick={() => navigate("/Subscriptions")}
          >
            Back to Subscriptions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-view-page">

      {/* HEADER */}

      <div className="subscription-view-header">
        <button
          type="button"
          className="subscription-view-back"
          onClick={() => navigate("/Subscriptions")}
        >
          <img src={arrowLeftIcon} alt="" />
          <span>Back to Subscriptions</span>
        </button>

        <button
          type="button"
          className="edit-subscription-button"
          onClick={() =>
            navigate(
              `/Subscriptions/${subscription.id}/edit`
            )
          }
        >
          <img src={editIcon} alt="" />
          <span>Edit Subscription</span>
        </button>
      </div>

      {/* SUBSCRIPTION SUMMARY */}

      <div className="subscription-summary-card">
        <div className="subscription-summary-left">
          <div className="subscription-large-icon">
            <img src={subscriptionsIcon} alt="" />
          </div>

          <div>
            <span className="summary-label">
              Subscription ID
            </span>

            <h2>{subscription.id}</h2>

            <p>
              {subscription.customer || "Customer"}
            </p>
          </div>
        </div>

        <div className="subscription-summary-status">
          <div>
            <span className="summary-label">
              Subscription Status
            </span>

            <StatusBadge status={subscription.status} />
          </div>

          <div>
            <span className="summary-label">
              Payment Status
            </span>

            <StatusBadge status={subscription.paymentStatus} />
          </div>
        </div>
      </div>

      {/* DETAIL CARDS */}

      <div className="subscription-detail-layout">

        {/* CUSTOMER INFORMATION */}

        <div className="subscription-detail-card">
          <div className="subscription-card-heading">
            <div className="subscription-heading-icon">
              <img src={customersIcon} alt="" />
            </div>

            <div>
              <h3>Customer Information</h3>
              <p>
                Customer linked to this subscription
              </p>
            </div>
          </div>

          <div className="subscription-detail-list">
            <div className="subscription-detail-row">
              <span>Customer</span>
              <strong>
                {subscription.customer || "-"}
              </strong>
            </div>

            <div className="subscription-detail-row">
              <span>Customer ID</span>
              <strong>
                {subscription.customerId || "-"}
              </strong>
            </div>
          </div>
        </div>

        {/* PLAN INFORMATION */}

        <div className="subscription-detail-card">
          <div className="subscription-card-heading">
            <div className="subscription-heading-icon">
              <img src={plansIcon} alt="" />
            </div>

            <div>
              <h3>Plan Information</h3>
              <p>
                Pricing plan associated with the subscription
              </p>
            </div>
          </div>

          <div className="subscription-detail-list">
            <div className="subscription-detail-row">
              <span>Plan</span>
              <strong>
                {subscription.plan || "-"}
              </strong>
            </div>

            <div className="subscription-detail-row">
              <span>Billing Cycle</span>
              <strong>
                {subscription.billingCycle || "-"}
              </strong>
            </div>

            <div className="subscription-detail-row">
              <span>Amount</span>
              <strong className="subscription-price">
                $
                {Number(
                  subscription.amount || 0
                ).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>

        {/* SUBSCRIPTION DATES */}

        <div className="subscription-detail-card">
          <div className="subscription-card-heading">
            <div className="subscription-heading-icon">
              <img src={subscriptionsIcon} alt="" />
            </div>

            <div>
              <h3>Subscription Dates</h3>
              <p>Subscription lifecycle dates</p>
            </div>
          </div>

          <div className="subscription-detail-list">
            <div className="subscription-detail-row">
              <span>Start Date</span>
              <strong>
                {subscription.startDate || "-"}
              </strong>
            </div>

            <div className="subscription-detail-row">
              <span>Renewal Date</span>
              <strong>
                {subscription.renewalDate || "-"}
              </strong>
            </div>
          </div>
        </div>

        {/* PAYMENT INFORMATION */}

        <div className="subscription-detail-card">
          <div className="subscription-card-heading">
            <div className="subscription-heading-icon">
              <img src={subscriptionsIcon} alt="" />
            </div>

            <div>
              <h3>Payment Information</h3>
              <p>Current payment status</p>
            </div>
          </div>

          <div className="subscription-detail-list">
            <div className="subscription-detail-row">
              <span>Payment Status</span>
              <StatusBadge
                status={subscription.paymentStatus}
              />
            </div>

            <div className="subscription-detail-row">
              <span>Subscription Amount</span>
              <strong className="subscription-price">
                $
                {Number(
                  subscription.amount || 0
                ).toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION OVERVIEW */}

      <div className="subscription-overview-card">
        <div className="subscription-overview-title">
          <h3>Subscription Overview</h3>
          <p>
            Quick summary of the current subscription.
          </p>
        </div>

        <div className="subscription-overview-items">
          <div>
            <span>Plan</span>
            <strong>
              {subscription.plan || "-"}
            </strong>
          </div>

          <div>
            <span>Billing</span>
            <strong>
              {subscription.billingCycle || "-"}
            </strong>
          </div>

          <div>
            <span>Amount</span>
            <strong>
              $
              {Number(
                subscription.amount || 0
              ).toLocaleString()}
            </strong>
          </div>

          <div>
            <span>Status</span>
            <StatusBadge status={subscription.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionView;