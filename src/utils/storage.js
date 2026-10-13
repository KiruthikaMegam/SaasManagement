/* =========================
   STORAGE KEYS
========================= */

export const STORAGE_KEYS = {
  USERS: "saasUsers",
  CUSTOMERS: "saasCustomers",
  PLANS: "saasPlans",
  SUBSCRIPTIONS: "saasSubscriptions",
  PAYMENTS: "saasPayments",
  USAGE: "saasUsage",
  REVENUE: "saasRevenue",
  ACTIVITIES: "saasActivities",
  LOGIN: "saasLogin"
};


/* =========================
   GET DATA
========================= */

export function getStorageData(
  key,
  fallbackData = []
) {
  try {
    const storedData =
      localStorage.getItem(key);

    if (!storedData) {
      return fallbackData;
    }

    const parsedData =
      JSON.parse(storedData);

    return parsedData;
  } catch {
    return fallbackData;
  }
}


/* =========================
   SAVE DATA
========================= */

export function setStorageData(
  key,
  data
) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

    return true;
  } catch {
    return false;
  }
}


/* =========================
   REMOVE DATA
========================= */

export function removeStorageData(key) {
  try {
    localStorage.removeItem(key);

    return true;
  } catch {
    return false;
  }
}


/* =========================
   CLEAR ALL SAAS DATA
========================= */

export function clearSaaSStorage() {
  try {
    localStorage.removeItem(
      STORAGE_KEYS.USERS
    );

    localStorage.removeItem(
      STORAGE_KEYS.CUSTOMERS
    );

    localStorage.removeItem(
      STORAGE_KEYS.PLANS
    );

    localStorage.removeItem(
      STORAGE_KEYS.SUBSCRIPTIONS
    );

    localStorage.removeItem(
      STORAGE_KEYS.PAYMENTS
    );

    localStorage.removeItem(
      STORAGE_KEYS.USAGE
    );

    localStorage.removeItem(
      STORAGE_KEYS.REVENUE
    );

    localStorage.removeItem(
      STORAGE_KEYS.ACTIVITIES
    );

    return true;
  } catch {
    return false;
  }
}


/* =========================
   LOGIN STORAGE
========================= */

export function saveLoginData(loginData) {
  return setStorageData(
    STORAGE_KEYS.LOGIN,
    loginData
  );
}


/* =========================
   GET LOGIN DATA
========================= */

export function getLoginData() {
  return getStorageData(
    STORAGE_KEYS.LOGIN,
    null
  );
}


/* =========================
   REMOVE LOGIN DATA
========================= */

export function removeLoginData() {
  return removeStorageData(
    STORAGE_KEYS.LOGIN
  );
}


/* =========================
   CHECK LOGIN
========================= */

export function isLoggedIn() {
  const loginData = getLoginData();

  if (!loginData) {
    return false;
  }

  if (loginData.isLoggedIn === true) {
    return true;
  }

  return false;
}


/* =========================
   SAVE SINGLE VALUE
========================= */

export function saveValue(
  key,
  value
) {
  try {
    localStorage.setItem(
      key,
      String(value)
    );

    return true;
  } catch {
    return false;
  }
}


/* =========================
   GET SINGLE VALUE
========================= */

export function getValue(
  key,
  fallbackValue = ""
) {
  try {
    const value =
      localStorage.getItem(key);

    if (value === null) {
      return fallbackValue;
    }

    return value;
  } catch {
    return fallbackValue;
  }
}


/* =========================
   REMOVE SINGLE VALUE
========================= */

export function removeValue(key) {
  try {
    localStorage.removeItem(key);

    return true;
  } catch {
    return false;
  }
}


/* =========================
   CHECK STORAGE KEY
========================= */

export function hasStorageData(key) {
  try {
    const value =
      localStorage.getItem(key);

    if (value === null) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}