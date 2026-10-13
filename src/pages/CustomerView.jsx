import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./CustomerView.css";

import { useSaaS } from "../context/SaaSContext";

import StatusBadge from "../components/StatusBadge";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

import customersIcon from "../assets/customers.png";
import arrowLeftIcon from "../assets/arrow-left.png";
import editIcon from "../assets/editIcon.png";
import subscriptionsIcon from "../assets/subscriptions.png";

function CustomerView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    customers = [],
    subscriptions = [],
    loading,
    error
  } = useSaaS();

  const customer = useMemo(() => {
    for (const item of customers) {
      if (String(item.id) === String(id)) {
        return item;
      }
    }

    return null;
  }, [customers, id]);

  const customerSubscriptions = useMemo(() => {
    const result = [];

    if (!customer) {
      return result;
    }

    for (const subscription of subscriptions) {
      const matchesCustomerId =
        String(subscription.customerId) === String(customer.id);

      const matchesCustomerName =
        subscription.customer === customer.company;

      if (matchesCustomerId || matchesCustomerName) {
        result.push(subscription);
      }
    }

    return result;
  }, [subscriptions, customer]);

  if (loading) {
    return (
      <div className="customer-view-page">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-view-page">
        <ErrorState
          title="Unable to load customer"
          message={error}
        />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="customer-view-page">
        <ErrorState
          title="Customer not found"
          message="The requested customer could not be found."
        />

        <button
          type="button"
          className="customer-back-button"
          onClick={() => navigate("/Customers")}
        >
          <img src={arrowLeftIcon} alt="" />
          <span>Back to Customers</span>
        </button>
      </div>
    );
  }

  return (
    <section className="customer-view-page">

      {/* Back and Edit Buttons */}
      <div className="customer-view-header">

        <button
          type="button"
          className="customer-back-button"
          onClick={() => navigate("/Customers")}
        >
          <img src={arrowLeftIcon} alt="" />
          <span>Back to Customers</span>
        </button>

        <button
          type="button"
          className="customer-edit-button"
          onClick={() =>
            navigate(`/Customers/${customer.id}/edit`)
          }
        >
          <img src={editIcon} alt="" />
          <span>Edit Customer</span>
        </button>

      </div>

      {/* Customer Profile */}
      <div className="customer-profile-card">
        <div className="customer-profile-main">

          <div className="customer-large-avatar">
            <img src={customersIcon} alt="" />
          </div>

          <div className="customer-profile-content">
            <h2>{customer.company || "—"}</h2>

            <p>{customer.contactName || "—"}</p>

            <div className="customer-profile-status">
              <StatusBadge status={customer.status} />
            </div>
          </div>

        </div>

        <div className="customer-profile-mrr">
          <span>Monthly Recurring Revenue</span>

          <strong>
            ${Number(customer.mrr || 0).toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Customer and Account Information */}
      <div className="customer-view-grid">

        <section className="customer-detail-card">
          <div className="customer-detail-card-header">

            <div className="customer-detail-card-icon">
              <img src={customersIcon} alt="" />
            </div>

            <div>
              <h2>Customer Information</h2>
              <p>Basic customer information</p>
            </div>

          </div>

          <div className="customer-detail-list">

            <div className="customer-detail-row">
              <span>Company</span>
              <strong>{customer.company || "—"}</strong>
            </div>

            <div className="customer-detail-row">
              <span>Contact Name</span>
              <strong>{customer.contactName || "—"}</strong>
            </div>

            <div className="customer-detail-row">
              <span>Email</span>
              <strong>{customer.email || "—"}</strong>
            </div>

            <div className="customer-detail-row">
              <span>Phone</span>
              <strong>{customer.phone || "—"}</strong>
            </div>

            <div className="customer-detail-row">
              <span>Country</span>
              <strong>{customer.country || "—"}</strong>
            </div>

            <div className="customer-detail-row">
              <span>Joined Date</span>
              <strong>{customer.joinedDate || "—"}</strong>
            </div>

          </div>
        </section>

        <section className="customer-detail-card">
          <div className="customer-detail-card-header">

            <div className="customer-detail-card-icon">
              <img src={subscriptionsIcon} alt="" />
            </div>

            <div>
              <h2>Account Information</h2>
              <p>Plan and account details</p>
            </div>

          </div>

          <div className="customer-detail-list">

            <div className="customer-detail-row">
              <span>Current Plan</span>
              <strong>{customer.plan || "—"}</strong>
            </div>

            <div className="customer-detail-row">
              <span>Users</span>
              <strong>{customer.users ?? 0}</strong>
            </div>

            <div className="customer-detail-row">
              <span>MRR</span>
              <strong>
                ${Number(customer.mrr || 0).toLocaleString()}
              </strong>
            </div>

            <div className="customer-detail-row">
              <span>Status</span>
              <StatusBadge status={customer.status} />
            </div>

            <div className="customer-detail-row">
              <span>Customer ID</span>
              <strong>#{customer.id}</strong>
            </div>

          </div>
        </section>

      </div>

      {/* Subscription History */}
      <section className="customer-subscriptions-card">

        <div className="customer-detail-card-header">

          <div className="customer-detail-card-icon">
            <img src={subscriptionsIcon} alt="" />
          </div>

          <div>
            <h2>Subscription History</h2>
            <p>Subscriptions associated with this customer</p>
          </div>

        </div>

        {customerSubscriptions.length === 0 ? (
          <div className="customer-no-subscriptions">
            <img src={subscriptionsIcon} alt="" />

            <h3>No subscription history</h3>

            <p>
              This customer does not have any subscription
              records yet.
            </p>
          </div>
        ) : (
          <div className="customer-subscription-list">

            {customerSubscriptions.map((subscription) => (
              <div
                className="customer-subscription-item"
                key={subscription.id}
              >

                <div className="customer-subscription-icon">
                  <img src={subscriptionsIcon} alt="" />
                </div>

                <div className="customer-subscription-info">
                  <strong>
                    {subscription.plan || "Subscription"}
                  </strong>

                  <span>
                    {subscription.billingCycle || "—"} billing
                  </span>
                </div>

                <div className="customer-subscription-amount">
                  <strong>
                    ${Number(subscription.amount || 0).toLocaleString()}
                  </strong>

                  <span>Amount</span>
                </div>

                <div className="customer-subscription-date">
                  <strong>{subscription.startDate || "—"}</strong>
                  <span>Start Date</span>
                </div>

                <div className="customer-subscription-date">
                  <strong>{subscription.renewalDate || "—"}</strong>
                  <span>Renewal Date</span>
                </div>

                <div className="customer-subscription-status">
                  <StatusBadge status={subscription.status} />
                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </section>
  );
}

export default CustomerView;