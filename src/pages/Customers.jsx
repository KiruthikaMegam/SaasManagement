import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Customers.css";

import { useSaaS } from "../context/SaaSContext";

import DataTable from "../components/DataTable";
import SearchFilter from "../components/SearchFilter";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

import usersIcon from "../assets/users.png";
import addIcon from "../assets/add.png";
import viewIcon from "../assets/view.png";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";
import customersIcon from "../assets/customers.png";

function Customers() {
  const navigate = useNavigate();

  const {
    customers = [],
    loading,
    error,
    deleteCustomer,
  } = useSaaS();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [sortBy, setSortBy] = useState("company");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const itemsPerPage = 8;

  // Status filter options
  const statusOptions = useMemo(() => {
    const values = [];

    for (const customer of customers) {
      const status = String(customer.status || "");

      if (status && !values.includes(status)) {
        values.push(status);
      }
    }

    return values.sort();
  }, [customers]);

  // Plan filter options
  const planOptions = useMemo(() => {
    const values = [];

    for (const customer of customers) {
      const plan = String(customer.plan || "");

      if (plan && !values.includes(plan)) {
        values.push(plan);
      }
    }

    return values.sort();
  }, [customers]);

  // Search, filter, and sort customers
  const filteredCustomers = useMemo(() => {
    const result = [];
    const searchValue = searchText.toLowerCase();

    for (const customer of customers) {
      const company = String(customer.company || "").toLowerCase();
      const contactName = String(customer.contactName || "").toLowerCase();
      const email = String(customer.email || "").toLowerCase();
      const phone = String(customer.phone || "").toLowerCase();
      const country = String(customer.country || "").toLowerCase();
      const plan = String(customer.plan || "").toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        company.includes(searchValue) ||
        contactName.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue) ||
        country.includes(searchValue) ||
        plan.includes(searchValue);

      const matchesStatus =
        statusFilter === "" ||
        String(customer.status || "") === statusFilter;

      const matchesPlan =
        planFilter === "" ||
        String(customer.plan || "") === planFilter;

      if (matchesSearch && matchesStatus && matchesPlan) {
        result.push(customer);
      }
    }

    result.sort((first, second) => {
      let firstValue = first[sortBy];
      let secondValue = second[sortBy];

      if (sortBy === "mrr" || sortBy === "users") {
        firstValue = Number(firstValue || 0);
        secondValue = Number(secondValue || 0);
      } else {
        firstValue = String(firstValue || "").toLowerCase();
        secondValue = String(secondValue || "").toLowerCase();
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
    customers,
    searchText,
    statusFilter,
    planFilter,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredCustomers.length / itemsPerPage
  );

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedCustomers = useMemo(() => {
    return filteredCustomers.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredCustomers, startIndex]);

  // Customer statistics
  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inactive"
  ).length;

  const trialCustomers = customers.filter(
    (customer) => customer.status === "Trial"
  ).length;

  // Search and filter handlers
  const handleSearchChange = (value) => {
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

  // Clear search and filter selections
  const handleClear = () => {
    setSearchText("");
    setStatusFilter("");
    setPlanFilter("");
    setSortBy("company");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  // Delete customer
  const handleDelete = () => {
    if (deleteId === null || deleteId === undefined) {
      return;
    }

    deleteCustomer(deleteId);
    setDeleteId(null);

    if (
      paginatedCustomers.length === 1 &&
      safeCurrentPage > 1
    ) {
      setCurrentPage(safeCurrentPage - 1);
    }
  };

  // Table columns
  const columns = [
    {
      key: "customer",
      title: "Customer",
      render: (customer) => (
        <div className="customer-info-cell">
          <div className="customer-avatar">
            <img src={customersIcon} alt="" />
          </div>

          <div className="customer-info-content">
            <strong>{customer.company || "—"}</strong>
            <span>{customer.contactName || "—"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (customer) => (
        <span className="customer-email">
          {customer.email || "—"}
        </span>
      ),
    },
    {
      key: "plan",
      title: "Plan",
      render: (customer) => (
        <span className="customer-plan">
          {customer.plan || "—"}
        </span>
      ),
    },
    {
      key: "users",
      title: "Users",
      render: (customer) => (
        <span className="customer-users">
          {customer.users ?? 0}
        </span>
      ),
    },
    {
      key: "mrr",
      title: "MRR",
      render: (customer) => (
        <span className="customer-mrr">
          ${Number(customer.mrr || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (customer) => (
        <StatusBadge status={customer.status} />
      ),
    },
    {
      key: "joinedDate",
      title: "Joined",
      render: (customer) => (
        <span>{customer.joinedDate || "—"}</span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (customer) => (
        <div className="customer-actions">
          <button
            type="button"
            className="customer-action-button view"
            onClick={() => navigate(`/Customers/${customer.id}`)}
            aria-label={`View ${customer.company || "customer"}`}
            title="View customer"
          >
            <img src={viewIcon} alt="" />
          </button>

          <button
            type="button"
            className="customer-action-button edit"
            onClick={() =>
              navigate(`/Customers/${customer.id}/edit`)
            }
            aria-label={`Edit ${customer.company || "customer"}`}
            title="Edit customer"
          >
            <img src={editIcon} alt="" />
          </button>

          <button
            type="button"
            className="customer-action-button delete"
            onClick={() => setDeleteId(customer.id)}
            aria-label={`Delete ${customer.company || "customer"}`}
            title="Delete customer"
          >
            <img src={deleteIcon} alt="" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="customers-page">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="customers-page">
        <ErrorState
          title="Unable to load customers"
          message={error}
        />
      </div>
    );
  }

  return (
    <section className="customers-page">
      {/* Header */}
      <div className="customers-header">
        <div className="customers-header-left">
          <div className="customers-title-icon">
            <img src={customersIcon} alt="" />
          </div>

          <div>
            <h1>Customers</h1>
            <p>
              Manage your SaaS customers and their subscriptions.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="customer-add-button"
          onClick={() => navigate("/Customers/add")}
        >
          <img src={addIcon} alt="" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="customer-stats">
        <div className="customer-stat-card">
          <div className="customer-stat-icon">
            <img src={customersIcon} alt="" />
          </div>

          <div>
            <span>Total Customers</span>
            <strong>{customers.length}</strong>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon active">
            <img src={usersIcon} alt="" />
          </div>

          <div>
            <span>Active Customers</span>
            <strong>{activeCustomers}</strong>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon inactive">
            <img src={customersIcon} alt="" />
          </div>

          <div>
            <span>Inactive Customers</span>
            <strong>{inactiveCustomers}</strong>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon trial">
            <img src={customersIcon} alt="" />
          </div>

          <div>
            <span>Trial Customers</span>
            <strong>{trialCustomers}</strong>
          </div>
        </div>
      </div>

      {/* Table and toolbar */}
      <div className="customers-content-card">
        <div className="customers-toolbar">
          <div className="customers-search">
            <SearchFilter
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search customers..."
              showFilter={false}
            />
          </div>

          <div className="customers-filters">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>

              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={planFilter}
              onChange={handlePlanChange}
              aria-label="Filter by plan"
            >
              <option value="">All Plans</option>

              {planOptions.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={handleSortChange}
              aria-label="Sort customers by"
            >
              <option value="company">Sort: Company</option>
              <option value="contactName">Contact Name</option>
              <option value="email">Email</option>
              <option value="plan">Plan</option>
              <option value="users">Users</option>
              <option value="mrr">MRR</option>
              <option value="joinedDate">Joined Date</option>
            </select>

            <select
              value={sortOrder}
              onChange={handleSortOrderChange}
              aria-label="Sort order"
            >
              <option value="asc">A–Z / Oldest</option>
              <option value="desc">Z–A / Newest</option>
            </select>

            <button
              type="button"
              className="customers-clear-button"
              onClick={handleClear}
              disabled={
                !searchText &&
                !statusFilter &&
                !planFilter &&
                sortBy === "company" &&
                sortOrder === "asc"
              }
            >
              Clear
            </button>
          </div>
        </div>

        {/* Customer table */}
        {filteredCustomers.length === 0 ? (
          <EmptyState
            icon={customersIcon}
            title="No customers found"
            message="Try changing your search or filter options."
          />
        ) : (
          <DataTable
            columns={columns}
            data={paginatedCustomers}
          />
        )}

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="customers-pagination">
            <div className="customers-pagination-info">
              Showing{" "}
              <strong>{startIndex + 1}</strong> to{" "}
              <strong>
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredCustomers.length
                )}
              </strong>{" "}
              of <strong>{filteredCustomers.length}</strong>
            </div>

            {totalPages > 1 && (
              <div className="customers-pagination-controls">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() =>
                    setCurrentPage(safeCurrentPage - 1)
                  }
                >
                  Previous
                </button>

                <div className="customers-page-numbers">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={
                        safeCurrentPage === page ? "active" : ""
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() =>
                    setCurrentPage(safeCurrentPage + 1)
                  }
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Delete Customer"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        type="danger"
      />
    </section>
  );
}

export default Customers;