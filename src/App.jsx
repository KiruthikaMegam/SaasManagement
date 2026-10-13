import React from "react";

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes
} from "react-router-dom";

import { SaaSProvider } from "./context/SaaSContext";

import Login from "./pages/Login";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";

import Users from "./pages/Users";
import UserAdd from "./pages/UserAdd";
import UserEdit from "./pages/UserEdit";
import UserView from "./pages/UserView";

import Customers from "./pages/Customers";
import CustomerAdd from "./pages/CustomerAdd";
import CustomerEdit from "./pages/CustomerEdit";
import CustomerView from "./pages/CustomerView";

import Subscriptions from "./pages/Subscriptions";
import SubscriptionAdd from "./pages/SubscriptionAdd";
import SubscriptionEdit from "./pages/SubscriptionEdit";
import SubscriptionView from "./pages/SubscriptionView";

import Plans from "./pages/Plans";
import PlanAdd from "./pages/PlanAdd";
import PlanEdit from "./pages/PlanEdit";
import PlanView from "./pages/PlanView";

import Usage from "./pages/Usage";
import Revenue from "./pages/Revenue";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

import "./App.css";


/* =========================
   PROTECTED ROUTE
========================= */

function ProtectedRoute() {
  const isLoggedIn =
    localStorage.getItem("saasLogin") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}


/* =========================
   LOGIN ROUTE
========================= */

function LoginRoute() {
  const isLoggedIn =
    localStorage.getItem("saasLogin") === "true";

  if (isLoggedIn) {
    return <Navigate to="/Dashboard" replace />;
  }

  return <Login />;
}


/* =========================
   APP
========================= */

function App() {
  return (
    <SaaSProvider>
      <BrowserRouter>
        <Routes>

          {/* LOGIN */}

          <Route
            path="/"
            element={<LoginRoute />}
          />


          {/* PROTECTED PAGES */}

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>

              {/* DASHBOARD */}

              <Route
                path="/Dashboard"
                element={<Dashboard />}
              />


              {/* USERS */}

              <Route
                path="/Users"
                element={<Users />}
              />

              <Route
                path="/Users/add"
                element={<UserAdd />}
              />

              <Route
                path="/Users/:id/edit"
                element={<UserEdit />}
              />

              <Route
                path="/Users/:id"
                element={<UserView />}
              />


              {/* CUSTOMERS */}

             <Route path="/Customers" element={<Customers />} />
<Route path="/Customers/add" element={<CustomerAdd />} />
<Route path="/Customers/:id/edit" element={<CustomerEdit />} />
<Route path="/Customers/:id" element={<CustomerView />} />


              {/* SUBSCRIPTIONS */}

              <Route
                path="/Subscriptions"
                element={<Subscriptions />}
              />

              <Route
                path="/Subscriptions/add"
                element={<SubscriptionAdd />}
              />

              <Route
                path="/Subscriptions/:id/edit"
                element={<SubscriptionEdit />}
              />

              <Route
                path="/Subscriptions/:id"
                element={<SubscriptionView />}
              />


              {/* PLANS */}

              <Route
                path="/Plans"
                element={<Plans />}
              />

              <Route
                path="/Plans/add"
                element={<PlanAdd />}
              />

              <Route
                path="/Plans/:id/edit"
                element={<PlanEdit />}
              />

              <Route
                path="/Plans/:id"
                element={<PlanView />}
              />


              {/* USAGE */}

              <Route
                path="/Usage"
                element={<Usage />}
              />


              {/* REVENUE */}

              <Route
                path="/Revenue"
                element={<Revenue />}
              />


              {/* ANALYTICS */}

              <Route
                path="/Analytics"
                element={<Analytics />}
              />


              {/* SETTINGS */}

              <Route
                path="/Settings"
                element={<Settings />}
              />

            </Route>
          </Route>


          {/* INVALID ROUTES */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </BrowserRouter>
    </SaaSProvider>
  );
}

export default App;