import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./PlanView.css";

import { useSaaS } from "../context/SaaSContext";

import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import StatusBadge from "../components/StatusBadge";

import plansIcon from "../assets/plans.png";
import subscribersIcon from "../assets/users.png";
import arrowLeftIcon from "../assets/arrow-left.png";
import editIcon from "../assets/editIcon.png";
import subscriptionsIcon from "../assets/subscriptions.png";

function PlanView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    plans = [],
    subscriptions = [],
    loading,
    error
  } = useSaaS();

  const plan = useMemo(() => {
    let selectedPlan = null;

    for (const item of plans) {
      if (String(item.id) === String(id)) {
        selectedPlan = item;
        break;
      }
    }

    return selectedPlan;
  }, [plans, id]);

  const subscriberCount = useMemo(() => {
    if (!plan) {
      return 0;
    }

    if (Number(plan.subscribers || 0) > 0) {
      return Number(plan.subscribers);
    }

    let count = 0;

    for (const subscription of subscriptions) {
      const subscriptionPlan = String(
        subscription.plan || ""
      ).toLowerCase();

      const planName = String(
        plan.name || ""
      ).toLowerCase();

      const subscriptionStatus = String(
        subscription.status || ""
      ).toLowerCase();

      if (
        subscriptionPlan === planName &&
        subscriptionStatus === "active"
      ) {
        count += 1;
      }
    }

    return count;
  }, [plan, subscriptions]);

  const planSubscriptions = useMemo(() => {
    const result = [];

    if (!plan) {
      return result;
    }

    for (const subscription of subscriptions) {
      const subscriptionPlan = String(
        subscription.plan || ""
      ).toLowerCase();

      const planName = String(
        plan.name || ""
      ).toLowerCase();

      if (subscriptionPlan === planName) {
        result.push(subscription);
      }
    }

    return result;
  }, [subscriptions, plan]);

  const formatLimit = (value, suffix = "") => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      String(value).toLowerCase() === "unlimited"
    ) {
      return "Unlimited";
    }

    return `${value}${suffix}`;
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

  if (!plan) {
    return (
      <div className="plan-view-page">
        <div className="plan-view-not-found">
          <div className="plan-view-not-found-icon">
            <img
              src={plansIcon}
              alt="Plan"
            />
          </div>

          <h2>Plan Not Found</h2>

          <p>
            The plan you are looking for does not
            exist or may have been removed.
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
    <div className="plan-view-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="plan-view-header">

        <button
          type="button"
          className="plan-view-back-button"
          onClick={() => navigate("/Plans")}
        >
          <img
            src={arrowLeftIcon}
            alt=""
          />
          <span>Back to Plans</span>
        </button>

        <div className="plan-view-header-actions">

          <button
            type="button"
            className="plan-view-edit-button"
            onClick={() =>
              navigate(`/Plans/${plan.id}/edit`)
            }
          >
            <img
              src={editIcon}
              alt=""
            />
            <span>Edit Plan</span>
          </button>

        </div>

      </div>

      {/* =====================================
          PLAN HERO
      ====================================== */}

      <div className="plan-view-hero">

        <div className="plan-view-hero-left">

          <div className="plan-view-plan-icon">
            <img
              src={plansIcon}
              alt="Plan"
            />
          </div>

          <div>
            <div className="plan-view-name-row">
              <h1>{plan.name}</h1>

              {plan.popular && (
                <span className="plan-view-popular">
                  Popular
                </span>
              )}
            </div>

            <p>
              {plan.description ||
                "No description available for this plan."}
            </p>
          </div>

        </div>

        <div className="plan-view-status">
          <StatusBadge status={plan.status} />
        </div>

      </div>

      {/* =====================================
          OVERVIEW CARDS
      ====================================== */}

      <div className="plan-view-overview">

        <div className="plan-view-overview-card">

          <div className="plan-view-overview-icon">
            <img
              src={plansIcon}
              alt=""
            />
          </div>

          <div>
            <span>Monthly Price</span>

            <strong>
              $
              {Number(
                plan.monthlyPrice || 0
              ).toLocaleString()}
            </strong>
          </div>

        </div>

        <div className="plan-view-overview-card">

          <div className="plan-view-overview-icon">
            <img
              src={plansIcon}
              alt=""
            />
          </div>

          <div>
            <span>Yearly Price</span>

            <strong>
              $
              {Number(
                plan.yearlyPrice || 0
              ).toLocaleString()}
            </strong>
          </div>

        </div>

        <div className="plan-view-overview-card">

          <div className="plan-view-overview-icon">
            <img
              src={subscribersIcon}
              alt=""
            />
          </div>

          <div>
            <span>Subscribers</span>

            <strong>
              {subscriberCount}
            </strong>
          </div>

        </div>

        <div className="plan-view-overview-card">

          <div className="plan-view-overview-icon">
            <img
              src={plansIcon}
              alt=""
            />
          </div>

          <div>
            <span>Trial Period</span>

            <strong>
              {plan.trialDays || 0} Days
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="plan-view-content">

        {/* PLAN INFORMATION */}

        <section className="plan-view-section">

          <div className="plan-view-section-header">

            <div className="plan-view-section-title">
              <div className="plan-view-section-icon">
                <img
                  src={plansIcon}
                  alt=""
                />
              </div>

              <div>
                <h2>Plan Information</h2>
                <p>
                  Pricing and configuration details
                </p>
              </div>
            </div>

          </div>

          <div className="plan-view-info-list">

            <div className="plan-view-info-item">
              <span>Plan Name</span>
              <strong>{plan.name}</strong>
            </div>

            <div className="plan-view-info-item">
              <span>Status</span>
              <StatusBadge status={plan.status} />
            </div>

            <div className="plan-view-info-item">
              <span>Monthly Price</span>
              <strong>
                $
                {Number(
                  plan.monthlyPrice || 0
                ).toLocaleString()}
              </strong>
            </div>

            <div className="plan-view-info-item">
              <span>Yearly Price</span>
              <strong>
                $
                {Number(
                  plan.yearlyPrice || 0
                ).toLocaleString()}
              </strong>
            </div>

            <div className="plan-view-info-item">
              <span>Trial Period</span>
              <strong>
                {plan.trialDays || 0} Days
              </strong>
            </div>

            <div className="plan-view-info-item">
              <span>Popular Plan</span>
              <strong>
                {plan.popular ? "Yes" : "No"}
              </strong>
            </div>

          </div>

        </section>

        {/* LIMITS */}

        <section className="plan-view-section">

          <div className="plan-view-section-header">

            <div className="plan-view-section-title">
              <div className="plan-view-section-icon">
                <img
                  src={plansIcon}
                  alt=""
                />
              </div>

              <div>
                <h2>Plan Limits</h2>
                <p>
                  Resources included with this plan
                </p>
              </div>
            </div>

          </div>

          <div className="plan-view-limits">

            <div className="plan-view-limit-card">
              <span>User Limit</span>
              <strong>
                {formatLimit(
                  plan.userLimit
                )}
              </strong>
              <small>
                Maximum users allowed
              </small>
            </div>

            <div className="plan-view-limit-card">
              <span>Storage Limit</span>
              <strong>
                {formatLimit(
                  plan.storageLimit
                )}
              </strong>
              <small>
                Storage available
              </small>
            </div>

            <div className="plan-view-limit-card">
              <span>API Limit</span>
              <strong>
                {formatLimit(
                  plan.apiLimit
                )}
              </strong>
              <small>
                API requests allowed
              </small>
            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section className="plan-view-section">

          <div className="plan-view-section-header">

            <div className="plan-view-section-title">
              <div className="plan-view-section-icon">
                <img
                  src={plansIcon}
                  alt=""
                />
              </div>

              <div>
                <h2>Plan Features</h2>
                <p>
                  Features included in this plan
                </p>
              </div>
            </div>

          </div>

          <div className="plan-view-features">

            {Array.isArray(plan.features) &&
            plan.features.length > 0 ? (
              plan.features.map(
                (feature, index) => (
                  <div
                    className="plan-view-feature"
                    key={`${plan.id}-feature-${index}`}
                  >
                    <span className="plan-view-feature-check">
                      ✓
                    </span>

                    <span>
                      {feature}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="plan-view-empty-features">
                No features have been added to
                this plan.
              </div>
            )}

          </div>

        </section>

        {/* SUBSCRIPTIONS */}

        <section className="plan-view-section">

          <div className="plan-view-section-header">

            <div className="plan-view-section-title">
              <div className="plan-view-section-icon">
                <img
                  src={subscriptionsIcon}
                  alt=""
                />
              </div>

              <div>
                <h2>Plan Subscriptions</h2>
                <p>
                  Customers currently using this plan
                </p>
              </div>
            </div>

            <button
              type="button"
              className="plan-view-section-action"
              onClick={() =>
                navigate("/Subscriptions")
              }
            >
              View All
            </button>

          </div>

          {planSubscriptions.length === 0 ? (
            <div className="plan-view-empty-subscriptions">
              <img
                src={subscribersIcon}
                alt=""
              />

              <p>
                No subscriptions found for this
                plan.
              </p>
            </div>
          ) : (
            <div className="plan-view-subscriptions">

              {planSubscriptions
                .slice(0, 5)
                .map((subscription) => (
                  <div
                    className="plan-view-subscription-row"
                    key={subscription.id}
                  >

                    <div className="plan-view-subscription-icon">
                      <img
                        src={subscribersIcon}
                        alt=""
                      />
                    </div>

                    <div className="plan-view-subscription-main">
                      <strong>
                        {subscription.customer ||
                          "Unknown Customer"}
                      </strong>

                      <span>
                        {subscription.billingCycle ||
                          "Monthly"}
                      </span>
                    </div>

                    <div className="plan-view-subscription-amount">
                      <strong>
                        $
                        {Number(
                          subscription.amount || 0
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <StatusBadge
                      status={
                        subscription.status
                      }
                    />

                    <button
                      type="button"
                      className="plan-view-subscription-view"
                      onClick={() =>
                        navigate(
                          `/Subscriptions/${subscription.id}`
                        )
                      }
                    >
                      View
                    </button>

                  </div>
                ))}

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default PlanView;