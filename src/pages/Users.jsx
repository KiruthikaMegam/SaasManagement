import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSaaS } from "../context/SaaSContext";

import SearchFilter from "../components/SearchFilter";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

import "./Users.css";

import userIcon from "../assets/users.png";
import addIcon from "../assets/add.png";
import viewIcon from "../assets/view.png";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";

function Users() {
  const navigate = useNavigate();

  const {
    users = [],
    deleteUser,
    loading,
    error,
    showToast
  } = useSaaS();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const planOptions = useMemo(() => {
    const uniquePlans = [];

    for (const user of users) {
      if (
        user.plan &&
        !uniquePlans.includes(user.plan)
      ) {
        uniquePlans.push(user.plan);
      }
    }

    return uniquePlans;
  }, [users]);

  const filteredUsers = useMemo(() => {
    let result = [];

    const searchValue = searchText.toLowerCase();

    for (const user of users) {
      const matchesSearch =
        searchValue === "" ||
        String(user.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(user.email || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(user.company || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(user.role || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "" ||
        String(user.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesPlan =
        planFilter === "" ||
        String(user.plan || "").toLowerCase() ===
          planFilter.toLowerCase();

      if (
        matchesSearch &&
        matchesStatus &&
        matchesPlan
      ) {
        result.push(user);
      }
    }

    result.sort((firstUser, secondUser) => {
      let firstValue = "";
      let secondValue = "";

      if (sortBy === "name") {
        firstValue = String(firstUser.name || "").toLowerCase();
        secondValue = String(secondUser.name || "").toLowerCase();
      }

      if (sortBy === "email") {
        firstValue = String(firstUser.email || "").toLowerCase();
        secondValue = String(secondUser.email || "").toLowerCase();
      }

      if (sortBy === "company") {
        firstValue = String(firstUser.company || "").toLowerCase();
        secondValue = String(secondUser.company || "").toLowerCase();
      }

      if (sortBy === "plan") {
        firstValue = String(firstUser.plan || "").toLowerCase();
        secondValue = String(secondUser.plan || "").toLowerCase();
      }

      if (sortBy === "createdAt") {
        firstValue = String(firstUser.createdAt || "");
        secondValue = String(secondUser.createdAt || "");
      }

      if (firstValue < secondValue) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (firstValue > secondValue) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

    return result;
  }, [
    users,
    searchText,
    statusFilter,
    planFilter,
    sortBy,
    sortOrder
  ]);

  const totalPages = Math.ceil(
    filteredUsers.length / itemsPerPage
  );

  const paginatedUsers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    const endIndex =
      startIndex + itemsPerPage;

    return filteredUsers.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredUsers,
    currentPage
  ]);

  const activeUsers = users.filter(
    (user) =>
      String(user.status || "").toLowerCase() ===
      "active"
  ).length;

  const inactiveUsers = users.filter(
    (user) =>
      String(user.status || "").toLowerCase() !==
      "active"
  ).length;

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handlePlanChange = (event) => {
    setPlanFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) {
      return;
    }

    deleteUser(selectedUser.id);

    setDeleteModalOpen(false);
    setSelectedUser(null);

    if (
      paginatedUsers.length === 1 &&
      currentPage > 1
    ) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter("");
    setPlanFilter("");
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const columns = [
    {
      key: "user",
      title: "User",
      render: (user) => (
        <div className="saas-user-table-profile">
          <div className="saas-user-avatar">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
              />
            ) : (
              <span>
                {String(user.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div className="saas-user-profile-info">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        </div>
      )
    },
    {
      key: "company",
      title: "Company",
      render: (user) => (
        <span className="saas-user-company">
          {user.company || "—"}
        </span>
      )
    },
    {
      key: "role",
      title: "Role",
      render: (user) => (
        <span className="saas-user-role">
          {user.role || "—"}
        </span>
      )
    },
    {
      key: "plan",
      title: "Plan",
      render: (user) => (
        <span className="saas-user-plan">
          {user.plan || "—"}
        </span>
      )
    },
    {
      key: "status",
      title: "Status",
      render: (user) => (
        <StatusBadge status={user.status} />
      )
    },
    {
      key: "lastLogin",
      title: "Last Login",
      render: (user) => (
        <span className="saas-user-date">
          {user.lastLogin || "—"}
        </span>
      )
    },
    {
      key: "actions",
      title: "Actions",
      render: (user) => (
        <div className="saas-user-actions">
          <button
            type="button"
            className="saas-user-action-button"
            onClick={() =>
              navigate(`/Users/${user.id}`)
            }
            aria-label={`View ${user.name}`}
          >
            <img
              src={viewIcon}
              alt=""
            />
          </button>

          <button
            type="button"
            className="saas-user-action-button"
            onClick={() =>
              navigate(`/Users/${user.id}/edit`)
            }
            aria-label={`Edit ${user.name}`}
          >
            <img
              src={editIcon}
              alt=""
            />
          </button>

          <button
            type="button"
            className="saas-user-action-button saas-user-delete-button"
            onClick={() =>
              handleDeleteClick(user)
            }
            aria-label={`Delete ${user.name}`}
          >
            <img
              src={deleteIcon}
              alt=""
            />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="saas-users-page-state">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="saas-users-page-state">
        <ErrorState
          title="Unable to load users"
          message={error}
        />
      </div>
    );
  }

  return (
    <section className="saas-users-page">
      <div className="saas-users-header">
        <div className="saas-users-heading">
          <div className="saas-users-title-icon">
            <img
              src={userIcon}
              alt=""
            />
          </div>

          <div>
            <h1>Users</h1>
            <p>
              Manage users, roles, plans and account
              status.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="saas-users-add-button"
          onClick={() =>
            navigate("/Users/add")
          }
        >
          <img
            src={addIcon}
            alt=""
          />
          <span>Add User</span>
        </button>
      </div>

      <div className="saas-users-stats">
        <div className="saas-users-stat-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
          <small>All registered users</small>
        </div>

        <div className="saas-users-stat-card">
          <span>Active Users</span>
          <strong>{activeUsers}</strong>
          <small>Currently active accounts</small>
        </div>

        <div className="saas-users-stat-card">
          <span>Inactive Users</span>
          <strong>{inactiveUsers}</strong>
          <small>Inactive or suspended accounts</small>
        </div>
      </div>

      <div className="saas-users-toolbar">
        <SearchFilter
          value={searchText}
          onChange={handleSearch}
          placeholder="Search users..."
        />

        <div className="saas-users-filters">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            aria-label="Filter users by status"
          >
            <option value="">
              All Statuses
            </option>
            <option value="Active">
              Active
            </option>
            <option value="Inactive">
              Inactive
            </option>
          </select>

          <select
            value={planFilter}
            onChange={handlePlanChange}
            aria-label="Filter users by plan"
          >
            <option value="">
              All Plans
            </option>

            {planOptions.map((plan) => (
              <option
                key={plan}
                value={plan}
              >
                {plan}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={handleSortChange}
            aria-label="Sort users"
          >
            <option value="name">
              Sort: Name
            </option>
            <option value="email">
              Sort: Email
            </option>
            <option value="company">
              Sort: Company
            </option>
            <option value="plan">
              Sort: Plan
            </option>
            <option value="createdAt">
              Sort: Created Date
            </option>
          </select>

          <select
            value={sortOrder}
            onChange={handleSortOrderChange}
            aria-label="Sort order"
          >
            <option value="asc">
              A-Z / Oldest
            </option>
            <option value="desc">
              Z-A / Newest
            </option>
          </select>

          <button
            type="button"
            className="saas-users-clear-button"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="saas-users-table-card">
        {filteredUsers.length === 0 ? (
          <EmptyState
            title="No users found"
            message="Try changing your search or filter options."
          />
        ) : (
          <DataTable
            columns={columns}
            data={paginatedUsers}
          />
        )}

        {filteredUsers.length > 0 &&
          totalPages > 1 && (
            <div className="saas-users-pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                Previous
              </button>

              <div className="saas-users-page-numbers">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={
                      currentPage === page
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage(page)
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >
                Next
              </button>
            </div>
          )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={
          selectedUser
            ? `Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`
            : "Are you sure you want to delete this user?"
        }
        confirmText="Delete User"
        cancelText="Cancel"
        type="danger"
      />
    </section>
  );
}

export default Users;