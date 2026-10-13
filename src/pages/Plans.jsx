import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Plans.css";

import { useSaaS } from "../context/SaaSContext";

import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import SearchFilter from "../components/SearchFilter";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";

import plansIcon from "../assets/plans.png";
import usersIcon from "../assets/users.png";
import addIcon from "../assets/add.png";

function Plans() {
  const navigate = useNavigate();

  const {
    plans = [],
    subscriptions = [],
    loading,
    error,
    deletePlan,
    showToast,
  } = useSaaS();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination: Previous and Next only
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Get subscriber count
  const getSubscriberCount = (plan) => {
    if (Number(plan.subscribers) > 0) {
      return Number(plan.subscribers);
    }

    return subscriptions.filter((subscription) => {
      const samePlan =
        String(subscription.planId) === String(plan.id) ||
        String(subscription.plan) === String(plan.name);

      return (
        samePlan &&
        String(subscription.status || "").toLowerCase() === "active"
      );
    }).length;
  };

  // Search, filter and sort plans
  const filteredPlans = useMemo(() => {
    let result = [...plans];

    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();

      result = result.filter((plan) => {
        const name = String(plan.name || "").toLowerCase();
        const description = String(plan.description || "").toLowerCase();

        return name.includes(search) || description.includes(search);
      });
    }

    if (statusFilter !== "All") {
      result = result.filter((plan) => {
        return (
          String(plan.status || "").toLowerCase() ===
          statusFilter.toLowerCase()
        );
      });
    }

    result.sort((a, b) => {
      let firstValue = a[sortBy];
      let secondValue = b[sortBy];

      if (sortBy === "name" || sortBy === "status") {
        firstValue = String(firstValue || "").toLowerCase();
        secondValue = String(secondValue || "").toLowerCase();

        if (firstValue < secondValue) {
          return sortOrder === "asc" ? -1 : 1;
        }

        if (firstValue > secondValue) {
          return sortOrder === "asc" ? 1 : -1;
        }

        return 0;
      }

      firstValue = Number(firstValue || 0);
      secondValue = Number(secondValue || 0);

      if (sortOrder === "asc") {
        return firstValue - secondValue;
      }

      return secondValue - firstValue;
    });

    return result;
  }, [plans, searchTerm, statusFilter, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPlans.length / itemsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const currentPlans = filteredPlans.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  // Statistics
  const totalPlans = plans.length;

  const activePlans = plans.filter((plan) => {
    return String(plan.status || "").toLowerCase() === "active";
  }).length;

  const totalSubscribers = plans.reduce((total, plan) => {
    return total + getSubscriberCount(plan);
  }, 0);

  const popularPlans = plans.filter((plan) => {
    return plan.popular === true;
  }).length;

  // Search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Status filter
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  // Sort selection
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  // Ascending / descending
  const handleSortOrder = () => {
    setSortOrder((previousOrder) => {
      return previousOrder === "asc" ? "desc" : "asc";
    });

    setCurrentPage(1);
  };

  // Reset filters
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  // Open delete modal
  const handleDeleteClick = (plan) => {
    setSelectedPlan(plan);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    if (deleting) {
      return;
    }

    setShowDeleteModal(false);
    setSelectedPlan(null);
  };

  // Delete plan
  const handleDelete = async () => {
    if (!selectedPlan || typeof deletePlan !== "function") {
      return;
    }

    setDeleting(true);

    try {
      await deletePlan(selectedPlan.id);

      setShowDeleteModal(false);
      setSelectedPlan(null);

      if (typeof showToast === "function") {
        showToast("Plan deleted successfully", "success");
      }
    } catch (deleteError) {
      console.error("Error deleting plan:", deleteError);

      if (typeof showToast === "function") {
        showToast("Failed to delete plan", "error");
      }
    } finally {
      setDeleting(false);
    }
  };

  // Table columns
  const planColumns = [
    {
      title: "Plan",
      key: "name",
      render: (plan) => (
        <div className="plans-main-cell">
          <div className="plans-row-icon">
            <img src={plansIcon} alt="Plan" />
          </div>

          <div className="plans-main-details">
            <span className="plans-plan-name">{plan.name}</span>

            <span className="plans-plan-description">
              {plan.description || "No description available"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Monthly Price",
      key: "monthlyPrice",
      render: (plan) => (
        <span className="plans-price">
          ${Number(plan.monthlyPrice || 0).toLocaleString("en-US")}
          <span className="plans-price-period">/mo</span>
        </span>
      ),
    },
    {
      title: "Yearly Price",
      key: "yearlyPrice",
      render: (plan) => (
        <span className="plans-price">
          ${Number(plan.yearlyPrice || 0).toLocaleString("en-US")}
          <span className="plans-price-period">/yr</span>
        </span>
      ),
    },
    {
      title: "User Limit",
      key: "userLimit",
      render: (plan) => (
        <span className="plans-user-limit">
          {plan.userLimit ?? 0}
        </span>
      ),
    },
    {
      title: "Subscribers",
      key: "subscribers",
      render: (plan) => (
        <div className="plans-subscriber-cell">
          <img src={usersIcon} alt="Subscribers" />
          <span>
            {getSubscriberCount(plan).toLocaleString("en-US")}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (plan) => <StatusBadge status={plan.status} />,
    },
    {
      title: "Popularity",
      key: "popular",
      render: (plan) =>
        plan.popular ? (
          <span className="plans-popular">Popular</span>
        ) : (
          <span className="plans-not-popular">—</span>
        ),
    },
  ];

  // Loading state
  if (loading) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="plans-page">
      {/* Page header */}
      <div className="plans-page-header">
        <div>
          <h1>Plans Management</h1>
          <p>Manage subscription plans, pricing and subscribers.</p>
        </div>

        <button
          type="button"
          className="plans-add-button"
          onClick={() => navigate("/Plans/add")}
        >
          <img src={addIcon} alt="" />
          <span>Add Plan</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="plans-stats">
        <div className="plans-stat-card">
          <div className="plans-stat-top">
            <div className="plans-stat-icon purple">
              <img src={plansIcon} alt="" />
            </div>
            <span className="plans-stat-label">Total Plans</span>
          </div>

          <h2>{totalPlans}</h2>
          <p>All subscription plans</p>
        </div>

        <div className="plans-stat-card">
          <div className="plans-stat-top">
            <div className="plans-stat-icon green">
              <img src={plansIcon} alt="" />
            </div>
            <span className="plans-stat-label">Active Plans</span>
          </div>

          <h2>{activePlans}</h2>
          <p>Currently available plans</p>
        </div>

        <div className="plans-stat-card">
          <div className="plans-stat-top">
            <div className="plans-stat-icon pink">
              <img src={usersIcon} alt="" />
            </div>
            <span className="plans-stat-label">Subscribers</span>
          </div>

          <h2>{totalSubscribers.toLocaleString("en-US")}</h2>
          <p>Subscribers across plans</p>
        </div>

        <div className="plans-stat-card">
          <div className="plans-stat-top">
            <div className="plans-stat-icon orange">
              <img src={plansIcon} alt="" />
            </div>
            <span className="plans-stat-label">Popular Plans</span>
          </div>

          <h2>{popularPlans}</h2>
          <p>Marked as popular</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="plans-filter-card">
        <div className="plans-search">
          <SearchFilter
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search plans..."
          />
        </div>

        <div className="plans-filter-controls">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            aria-label="Filter plans by status"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={handleSortChange}
            aria-label="Sort plans by"
          >
            <option value="name">Sort by Name</option>
            <option value="monthlyPrice">Sort by Monthly Price</option>
            <option value="yearlyPrice">Sort by Yearly Price</option>
            <option value="userLimit">Sort by User Limit</option>
          </select>

          <button
            type="button"
            className="plans-reset-button"
            onClick={handleReset}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Plans table */}
      <div className="plans-table-section">
        <div className="plans-table-heading">
          <div>
            <h2>All Plans</h2>
            <p>{filteredPlans.length} plans found</p>
          </div>

          <button
            type="button"
            className="plans-sort-button"
            onClick={handleSortOrder}
            title={
              sortOrder === "asc"
                ? "Sort descending"
                : "Sort ascending"
            }
          >
            Name {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="plans-table-card">
          {filteredPlans.length === 0 ? (
            <EmptyState
              title="No plans found"
              message="Try changing your search or filters."
            />
          ) : (
            <DataTable
              columns={planColumns}
              data={currentPlans}
              onView={(plan) => navigate(`/Plans/${plan.id}`)}
              onEdit={(plan) => navigate(`/Plans/${plan.id}/edit`)}
              onDelete={handleDeleteClick}
              emptyMessage="No plans found"
            />
          )}
        </div>

        {/* Previous and Next only */}
        {filteredPlans.length > 0 && totalPages > 1 && (
          <div className="plans-pagination">
            <button
              type="button"
              className="plans-pagination-button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage(safePage - 1)}
            >
              Previous
            </button>

            <span className="plans-pagination-info">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              className="plans-pagination-button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Delete Plan"
        message={
          selectedPlan
            ? `Are you sure you want to delete "${selectedPlan.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this plan?"
        }
        confirmText={deleting ? "Deleting..." : "Delete Plan"}
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

export default Plans;