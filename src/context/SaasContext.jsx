import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import {
  defaultUsers,
  defaultCustomers,
  defaultPlans,
  defaultSubscriptions,
  defaultPayments,
  defaultUsage,
  defaultRevenue,
  defaultSubscriptionComparison,
  defaultPlanComparison,
  defaultActivities,
  defaultDashboardStats
} from "../data/dummyData";


const SaaSContext = createContext();


/* =========================
   GET STORED DATA
========================= */

function getStoredData(key, fallbackData) {
  try {
    const storedData = localStorage.getItem(key);

    if (storedData) {
      return JSON.parse(storedData);
    }

    return fallbackData;
  } catch {
    return fallbackData;
  }
}


/* =========================
   PROVIDER
========================= */

function SaaSProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [usage, setUsage] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [activities, setActivities] = useState([]);

  const [
    subscriptionComparison
  ] = useState(defaultSubscriptionComparison);

  const [
    planComparison
  ] = useState(defaultPlanComparison);

  const [
    dashboardStats
  ] = useState(defaultDashboardStats);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [toast, setToast] = useState(null);

  const toastTimerRef = useRef(null);


  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    const loadData = () => {
      try {
        setUsers(
          getStoredData(
            "saasUsers",
            defaultUsers
          )
        );

        setCustomers(
          getStoredData(
            "saasCustomers",
            defaultCustomers
          )
        );

        setPlans(
          getStoredData(
            "saasPlans",
            defaultPlans
          )
        );

        setSubscriptions(
          getStoredData(
            "saasSubscriptions",
            defaultSubscriptions
          )
        );

        setPayments(
          getStoredData(
            "saasPayments",
            defaultPayments
          )
        );

        setUsage(
          getStoredData(
            "saasUsage",
            defaultUsage
          )
        );

        setRevenue(
          getStoredData(
            "saasRevenue",
            defaultRevenue
          )
        );

        setActivities(
          getStoredData(
            "saasActivities",
            defaultActivities
          )
        );

        setError("");
      } catch {
        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  /* =========================
     CLEAN TOAST TIMER
  ========================= */

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(
          toastTimerRef.current
        );
      }
    };
  }, []);


  /* =========================
     LOCAL STORAGE
  ========================= */

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "saasUsers",
        JSON.stringify(users)
      );
    }
  }, [users, loading]);


  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "saasCustomers",
        JSON.stringify(customers)
      );
    }
  }, [customers, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "saasPlans",
        JSON.stringify(plans)
      );
    }
  }, [plans, loading]);


  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "saasSubscriptions",
        JSON.stringify(
          subscriptions
        )
      );
    }
  }, [subscriptions, loading]);


  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "saasPayments",
        JSON.stringify(payments)
      );
    }
  }, [payments, loading]);


  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "saasUsage",
        JSON.stringify(usage)
      );
    }
  }, [usage, loading]);


  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "saasRevenue",
        JSON.stringify(revenue)
      );
    }
  }, [revenue, loading]);


  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "saasActivities",
        JSON.stringify(activities)
      );
    }
  }, [activities, loading]);


  /* =========================
     TOAST
========================= */

  const showToast = (
    message,
    type = "success"
  ) => {
    if (toastTimerRef.current) {
      clearTimeout(
        toastTimerRef.current
      );
    }

    const toastData = {
      id: Date.now(),
      message,
      type
    };

    setToast(toastData);

    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3000);
  };


  const hideToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(
        toastTimerRef.current
      );

      toastTimerRef.current = null;
    }

    setToast(null);
  };


  /* =========================
     USER CRUD
  ========================= */

  const addUser = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData
    };

    setUsers((previousUsers) => [
      ...previousUsers,
      newUser
    ]);

    showToast(
      "User added successfully.",
      "success"
    );

    return newUser;
  };


  const updateUser = (
    userId,
    userData
  ) => {
    setUsers((previousUsers) =>
      previousUsers.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            ...userData
          };
        }

        return user;
      })
    );

    showToast(
      "User updated successfully.",
      "success"
    );
  };


  const deleteUser = (userId) => {
    setUsers((previousUsers) =>
      previousUsers.filter(
        (user) =>
          user.id !== userId
      )
    );

    showToast(
      "User deleted successfully.",
      "success"
    );
  };


  /* =========================
     CUSTOMER CRUD
  ========================= */

  const addCustomer = (
    customerData
  ) => {
    const newCustomer = {
      id: Date.now(),
      ...customerData
    };

    setCustomers(
      (previousCustomers) => [
        ...previousCustomers,
        newCustomer
      ]
    );

    showToast(
      "Customer added successfully.",
      "success"
    );

    return newCustomer;
  };



const updateCustomer = (customerId, customerData) => {
  const targetId = String(customerId);

  try {
    // Read the latest saved customers instead of relying on
    // potentially outdated state captured by this function.
    const storedCustomers = localStorage.getItem("saasCustomers");

    const latestCustomers = storedCustomers
      ? JSON.parse(storedCustomers)
      : customers;

    if (!Array.isArray(latestCustomers)) {
      showToast("Unable to read customer data.", "error");
      return false;
    }

    let customerFound = false;

    const updatedCustomers = latestCustomers.map((customer) => {
      if (String(customer.id) === targetId) {
        customerFound = true;

        return {
          ...customer,
          ...customerData,
          id: customer.id,
        };
      }

      return customer;
    });

    if (!customerFound) {
      showToast("Customer not found.", "error");
      return false;
    }

    // Save first, then update React state.
    localStorage.setItem(
      "saasCustomers",
      JSON.stringify(updatedCustomers)
    );

    setCustomers(updatedCustomers);

    showToast("Customer updated successfully.", "success");

    return true;
  } catch (error) {
    showToast("Unable to save customer changes.", "error");
    return false;
  }
};


  const deleteCustomer = (
    customerId
  ) => {
    setCustomers(
      (previousCustomers) =>
        previousCustomers.filter(
          (customer) =>
            customer.id !==
            customerId
        )
    );

    showToast(
      "Customer deleted successfully.",
      "success"
    );
  };


  /* =========================
     PLAN CRUD
  ========================= */

  const addPlan = (planData) => {
    const newPlan = {
      id: Date.now(),
      subscribers: 0,
      ...planData
    };

    setPlans((previousPlans) => [
      ...previousPlans,
      newPlan
    ]);

    showToast(
      "Plan added successfully.",
      "success"
    );

    return newPlan;
  };


const updatePlan = (planId, planData) => {
  let planExists = false;

  for (const plan of plans) {
    if (String(plan.id) === String(planId)) {
      planExists = true;
      break;
    }
  }

  if (!planExists) {
    throw new Error("Plan not found.");
  }

  const updatedPlans = plans.map((plan) => {
    if (String(plan.id) === String(planId)) {
      return {
        ...plan,
        ...planData,
        id: plan.id
      };
    }

    return plan;
  });

  // Update React state
  setPlans(updatedPlans);

  // Save updated plans immediately
  localStorage.setItem(
    "saasPlans",
    JSON.stringify(updatedPlans)
  );
};


  const deletePlan = (planId) => {
    setPlans((previousPlans) =>
      previousPlans.filter(
        (plan) =>
          plan.id !== planId
      )
    );

    showToast(
      "Plan deleted successfully.",
      "success"
    );
  };


  /* =========================
     SUBSCRIPTION CRUD
  ========================= */

  const addSubscription = (
    subscriptionData
  ) => {
    const newSubscription = {
      id: Date.now(),
      ...subscriptionData
    };

    setSubscriptions(
      (previousSubscriptions) => [
        ...previousSubscriptions,
        newSubscription
      ]
    );

    showToast(
      "Subscription added successfully.",
      "success"
    );

    return newSubscription;
  };



const updateSubscription = (subscriptionId, subscriptionData) => {
  const updatedSubscriptions = subscriptions.map((subscription) => {
    if (String(subscription.id) === String(subscriptionId)) {
      return {
        ...subscription,
        ...subscriptionData,
        id: subscription.id
      };
    }

    return subscription;
  });

  const found = updatedSubscriptions.some(
    (subscription, index) =>
      String(subscription.id) === String(subscriptionId) &&
      JSON.stringify(subscription) !== JSON.stringify(subscriptions[index])
  );

  const exists = subscriptions.some(
    (subscription) => String(subscription.id) === String(subscriptionId)
  );

  if (!exists) {
    showToast("Subscription not found.", "error");
    return false;
  }

  localStorage.setItem(
    "saasSubscriptions",
    JSON.stringify(updatedSubscriptions)
  );

  setSubscriptions(updatedSubscriptions);
  showToast("Subscription updated successfully.", "success");

  return true;
};

  const cancelSubscription = (
    subscriptionId
  ) => {
    setSubscriptions(
      (previousSubscriptions) =>
        previousSubscriptions.map(
          (subscription) => {
            if (
              subscription.id ===
              subscriptionId
            ) {
              return {
                ...subscription,
                status: "Cancelled"
              };
            }

            return subscription;
          }
        )
    );

    showToast(
      "Subscription cancelled successfully.",
      "success"
    );
  };


  const deleteSubscription = (
    subscriptionId
  ) => {
    setSubscriptions(
      (previousSubscriptions) =>
        previousSubscriptions.filter(
          (subscription) =>
            subscription.id !==
            subscriptionId
        )
    );

    showToast(
      "Subscription deleted successfully.",
      "success"
    );
  };


  /* =========================
     PAYMENT CRUD
  ========================= */

  const addPayment = (
    paymentData
  ) => {
    const newPayment = {
      id: Date.now(),
      ...paymentData
    };

    setPayments(
      (previousPayments) => [
        ...previousPayments,
        newPayment
      ]
    );

    showToast(
      "Payment added successfully.",
      "success"
    );

    return newPayment;
  };


  const updatePayment = (
    paymentId,
    paymentData
  ) => {
    setPayments(
      (previousPayments) =>
        previousPayments.map(
          (payment) => {
            if (
              payment.id ===
              paymentId
            ) {
              return {
                ...payment,
                ...paymentData
              };
            }

            return payment;
          }
        )
    );

    showToast(
      "Payment updated successfully.",
      "success"
    );
  };


  const deletePayment = (
    paymentId
  ) => {
    setPayments(
      (previousPayments) =>
        previousPayments.filter(
          (payment) =>
            payment.id !== paymentId
        )
    );

    showToast(
      "Payment deleted successfully.",
      "success"
    );
  };


  /* =========================
     RESET DATA
  ========================= */
const resetData = () => {
  // Restore default data in React state
  setUsers(defaultUsers);
  setCustomers(defaultCustomers);
  setPlans(defaultPlans);
  setSubscriptions(defaultSubscriptions);
  setPayments(defaultPayments);
  setUsage(defaultUsage);
  setRevenue(defaultRevenue);
  setActivities(defaultActivities);

  // Persist the defaults immediately
  try {
    localStorage.setItem("saasUsers", JSON.stringify(defaultUsers));
    localStorage.setItem("saasCustomers", JSON.stringify(defaultCustomers));
    localStorage.setItem("saasPlans", JSON.stringify(defaultPlans));
    localStorage.setItem("saasSubscriptions", JSON.stringify(defaultSubscriptions));
    localStorage.setItem("saasPayments", JSON.stringify(defaultPayments));
    localStorage.setItem("saasUsage", JSON.stringify(defaultUsage));
    localStorage.setItem("saasRevenue", JSON.stringify(defaultRevenue));
    localStorage.setItem("saasActivities", JSON.stringify(defaultActivities));

    showToast("Dashboard data has been reset.", "success");
  } catch (error) {
    console.error("Unable to persist reset data:", error);
    showToast("Dashboard reset could not be saved.", "error");
  }
};

  /* =========================
     CONTEXT VALUE
  ========================= */

  const contextValue = {
    users,
    customers,
    plans,
    subscriptions,
    payments,
    usage,
    revenue,
    activities,

    subscriptionComparison,
    planComparison,

    dashboardStats,

    loading,
    error,

    toast,

    showToast,
    hideToast,

    addUser,
    updateUser,
    deleteUser,

    addCustomer,
    updateCustomer,
    deleteCustomer,

    addPlan,
    updatePlan,
    deletePlan,

    addSubscription,
    updateSubscription,
    cancelSubscription,
    deleteSubscription,

    addPayment,
    updatePayment,
    deletePayment,

    resetData
  };


  return (
    <SaaSContext.Provider
      value={contextValue}
    >
      {children}
    </SaaSContext.Provider>
  );
}


/* =========================
   CUSTOM HOOK
========================= */

export function useSaaS() {
  const context =
    useContext(SaaSContext);

  if (!context) {
    throw new Error(
      "useSaaS must be used inside SaaSProvider"
    );
  }

  return context;
}


export { SaaSProvider };