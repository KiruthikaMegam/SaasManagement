import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSaaS } from "../context/SaaSContext";

import StatusBadge from "../components/StatusBadge";
import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";

import "./UserView.css";

import backIcon from "../assets/arrow-left.png";
import editIcon from "../assets/editIcon.png";
import userIcon from "../assets/users.png";

function UserView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    users = [],
    subscriptions = [],
    loading,
    error
  } = useSaaS();

  let user = null;

  for (const item of users) {
    if (String(item.id) === String(id)) {
      user = item;
      break;
    }
  }

  if (loading) {
    return (
      <div className="saas-user-view-state">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="saas-user-view-state">
        <ErrorState
          title="Unable to load user"
          message={error}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="saas-user-view-state">
        <ErrorState
          title="User not found"
          message="The requested user could not be found."
        />

        <button
          type="button"
          className="saas-user-view-back-button"
          onClick={() => navigate("/Users")}
        >
          Back to Users
        </button>
      </div>
    );
  }

  const userSubscriptions = [];

  for (const subscription of subscriptions) {
    if (
      String(subscription.customerId) ===
        String(user.id) ||
      String(subscription.customer) ===
        String(user.company)
    ) {
      userSubscriptions.push(subscription);
    }
  }

  const initials = String(user.name || "U")
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="saas-user-view-page">
      <div className="saas-user-view-header">
        <button
          type="button"
          className="saas-user-view-back"
          onClick={() => navigate("/Users")}
        >
          <img
            src={backIcon}
            alt=""
          />
          <span>Back to Users</span>
        </button>

        <button
          type="button"
          className="saas-user-view-edit"
          onClick={() =>
            navigate(`/Users/${user.id}/edit`)
          }
        >
          <img
            src={editIcon}
            alt=""
          />
          <span>Edit User</span>
        </button>
      </div>

      <div className="saas-user-view-profile-card">
        <div className="saas-user-view-profile">
          <div className="saas-user-view-avatar">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="saas-user-view-main-info">
            <h1>{user.name}</h1>

            <p>{user.email}</p>

            <div className="saas-user-view-badges">
              <StatusBadge status={user.status} />

              <span className="saas-user-view-plan-badge">
                {user.plan || "No Plan"}
              </span>
            </div>
          </div>
        </div>

        <div className="saas-user-view-profile-icon">
          <img
            src={userIcon}
            alt=""
          />
        </div>
      </div>

      <div className="saas-user-view-layout">
        <div className="saas-user-view-card">
          <div className="saas-user-view-card-heading">
            <h2>Personal Information</h2>
            <p>User account details</p>
          </div>

          <div className="saas-user-view-details">
            <div className="saas-user-detail">
              <span>Full Name</span>
              <strong>{user.name || "—"}</strong>
            </div>

            <div className="saas-user-detail">
              <span>Email Address</span>
              <strong>{user.email || "—"}</strong>
            </div>

            <div className="saas-user-detail">
              <span>Role</span>
              <strong>{user.role || "—"}</strong>
            </div>

            <div className="saas-user-detail">
              <span>Company</span>
              <strong>{user.company || "—"}</strong>
            </div>

            <div className="saas-user-detail">
              <span>Country</span>
              <strong>{user.country || "—"}</strong>
            </div>

            <div className="saas-user-detail">
              <span>Status</span>
              <StatusBadge status={user.status} />
            </div>
          </div>
        </div>

        <div className="saas-user-view-card">
          <div className="saas-user-view-card-heading">
            <h2>Account Information</h2>
            <p>Plan and account activity</p>
          </div>

          <div className="saas-user-view-details">
            <div className="saas-user-detail">
              <span>Current Plan</span>
              <strong>
                {user.plan || "No Plan"}
              </strong>
            </div>

            <div className="saas-user-detail">
              <span>Last Login</span>
              <strong>
                {user.lastLogin || "—"}
              </strong>
            </div>

            <div className="saas-user-detail">
              <span>Created Date</span>
              <strong>
                {user.createdAt || "—"}
              </strong>
            </div>

            <div className="saas-user-detail">
              <span>User ID</span>
              <strong>#{user.id}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="saas-user-view-card saas-user-view-subscription-card">
        <div className="saas-user-view-card-heading">
          <h2>Subscription History</h2>
          <p>
            Subscription records associated with this
            user.
          </p>
        </div>

        {userSubscriptions.length === 0 ? (
          <div className="saas-user-no-subscription">
            <p>No subscription history available.</p>
          </div>
        ) : (
          <div className="saas-user-subscription-list">
            {userSubscriptions.map(
              (subscription) => (
                <div
                  className="saas-user-subscription-item"
                  key={subscription.id}
                >
                  <div>
                    <strong>
                      {subscription.plan ||
                        "Subscription"}
                    </strong>

                    <span>
                      {subscription.billingCycle ||
                        "—"}
                    </span>
                  </div>

                  <div>
                    <strong>
                      {subscription.amount
                        ? `$${subscription.amount}`
                        : "—"}
                    </strong>

                    <StatusBadge
                      status={
                        subscription.status
                      }
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default UserView;