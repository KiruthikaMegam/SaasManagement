/* =========================
   CURRENCY FORMATTER
========================= */

export function formatCurrency(
  amount,
  currency = "USD"
) {
  const numberValue = Number(amount);

  if (Number.isNaN(numberValue)) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numberValue);
}


/* =========================
   COMPACT CURRENCY
========================= */

export function formatCompactCurrency(
  amount,
  currency = "USD"
) {
  const numberValue = Number(amount);

  if (Number.isNaN(numberValue)) {
    return "$0";
  }

  if (numberValue >= 1000000) {
    return (
      "$" +
      (numberValue / 1000000).toFixed(1) +
      "M"
    );
  }

  if (numberValue >= 1000) {
    return (
      "$" +
      (numberValue / 1000).toFixed(1) +
      "K"
    );
  }

  if (currency === "USD") {
    return "$" + numberValue.toFixed(0);
  }

  return numberValue.toFixed(0);
}


/* =========================
   NUMBER FORMATTER
========================= */

export function formatNumber(number) {
  const numberValue = Number(number);

  if (Number.isNaN(numberValue)) {
    return "0";
  }

  return new Intl.NumberFormat("en-US").format(
    numberValue
  );
}


/* =========================
   COMPACT NUMBER
========================= */

export function formatCompactNumber(number) {
  const numberValue = Number(number);

  if (Number.isNaN(numberValue)) {
    return "0";
  }

  if (numberValue >= 1000000) {
    return (
      (numberValue / 1000000).toFixed(1) +
      "M"
    );
  }

  if (numberValue >= 1000) {
    return (
      (numberValue / 1000).toFixed(1) +
      "K"
    );
  }

  return String(numberValue);
}


/* =========================
   PERCENTAGE FORMATTER
========================= */

export function formatPercentage(
  value,
  decimals = 2
) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return "0%";
  }

  return (
    numberValue.toFixed(decimals) +
    "%"
  );
}


/* =========================
   DATE FORMATTER
========================= */

export function formatDate(date) {
  if (!date) {
    return "-";
  }

  const dateValue = new Date(date);

  if (Number.isNaN(dateValue.getTime())) {
    return "-";
  }

  return dateValue.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric"
    }
  );
}


/* =========================
   LONG DATE FORMATTER
========================= */

export function formatLongDate(date) {
  if (!date) {
    return "-";
  }

  const dateValue = new Date(date);

  if (Number.isNaN(dateValue.getTime())) {
    return "-";
  }

  return dateValue.toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric"
    }
  );
}


/* =========================
   MONTH FORMATTER
========================= */

export function formatMonth(date) {
  if (!date) {
    return "-";
  }

  const dateValue = new Date(date);

  if (Number.isNaN(dateValue.getTime())) {
    return "-";
  }

  return dateValue.toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric"
    }
  );
}


/* =========================
   DATE TIME FORMATTER
========================= */

export function formatDateTime(date) {
  if (!date) {
    return "-";
  }

  const dateValue = new Date(date);

  if (Number.isNaN(dateValue.getTime())) {
    return "-";
  }

  return dateValue.toLocaleString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}


/* =========================
   STORAGE FORMATTER
========================= */

export function formatStorage(
  value,
  unit = "GB"
) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return "0 GB";
  }

  if (unit === "MB") {
    if (numberValue >= 1024) {
      return (
        (numberValue / 1024).toFixed(1) +
        " GB"
      );
    }

    return numberValue + " MB";
  }

  if (unit === "GB") {
    if (numberValue >= 1024) {
      return (
        (numberValue / 1024).toFixed(1) +
        " TB"
      );
    }

    return numberValue + " GB";
  }

  if (unit === "TB") {
    return numberValue + " TB";
  }

  return numberValue + " " + unit;
}


/* =========================
   FILE SIZE FORMATTER
========================= */

export function formatFileSize(bytes) {
  const numberValue = Number(bytes);

  if (
    Number.isNaN(numberValue) ||
    numberValue <= 0
  ) {
    return "0 Bytes";
  }

  if (numberValue < 1024) {
    return numberValue + " Bytes";
  }

  if (numberValue < 1024 * 1024) {
    return (
      (numberValue / 1024).toFixed(1) +
      " KB"
    );
  }

  if (numberValue < 1024 * 1024 * 1024) {
    return (
      (numberValue / (1024 * 1024)).toFixed(1) +
      " MB"
    );
  }

  return (
    (numberValue / (1024 * 1024 * 1024)).toFixed(
      1
    ) +
    " GB"
  );
}


/* =========================
   TEXT CAPITALIZE
========================= */

export function capitalizeText(text) {
  if (!text) {
    return "";
  }

  const textValue = String(text);

  return (
    textValue.charAt(0).toUpperCase() +
    textValue.slice(1)
  );
}


/* =========================
   TITLE CASE
========================= */

export function formatTitle(text) {
  if (!text) {
    return "";
  }

  const words = String(text).split(" ");
  const formattedWords = [];

  for (const word of words) {
    if (!word) {
      continue;
    }

    const formattedWord =
      word.charAt(0).toUpperCase() +
      word.slice(1).toLowerCase();

    formattedWords.push(formattedWord);
  }

  return formattedWords.join(" ");
}


/* =========================
   STATUS FORMATTER
========================= */

export function formatStatus(status) {
  if (!status) {
    return "-";
  }

  const statusMap = {
    active: "Active",
    inactive: "Inactive",
    trial: "Trial",
    expired: "Expired",
    "past due": "Past Due",
    cancelled: "Cancelled",
    canceled: "Cancelled",
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    completed: "Completed"
  };

  const statusKey =
    String(status).toLowerCase();

  if (statusMap[statusKey]) {
    return statusMap[statusKey];
  }

  return formatTitle(status);
}


/* =========================
   BILLING CYCLE FORMATTER
========================= */

export function formatBillingCycle(
  billingCycle
) {
  if (!billingCycle) {
    return "-";
  }

  const cycle =
    String(billingCycle).toLowerCase();

  if (cycle === "monthly") {
    return "Monthly";
  }

  if (cycle === "yearly") {
    return "Yearly";
  }

  return formatTitle(billingCycle);
}


/* =========================
   PLAN NAME FORMATTER
========================= */

export function formatPlanName(plan) {
  if (!plan) {
    return "-";
  }

  return formatTitle(plan);
}


/* =========================
   CHANGE FORMATTER
========================= */

export function formatChange(value) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return "0%";
  }

  if (numberValue > 0) {
    return "+" + numberValue.toFixed(2) + "%";
  }

  if (numberValue < 0) {
    return numberValue.toFixed(2) + "%";
  }

  return "0%";
}


/* =========================
   DURATION FORMATTER
========================= */

export function formatDuration(days) {
  const numberValue = Number(days);

  if (
    Number.isNaN(numberValue) ||
    numberValue <= 0
  ) {
    return "0 Days";
  }

  if (numberValue === 1) {
    return "1 Day";
  }

  return numberValue + " Days";
}


/* =========================
   USER LIMIT FORMATTER
========================= */

export function formatUserLimit(limit) {
  const numberValue = Number(limit);

  if (Number.isNaN(numberValue)) {
    return "0 Users";
  }

  if (numberValue === 1) {
    return "1 User";
  }

  return formatNumber(numberValue) + " Users";
}


/* =========================
   API REQUEST FORMATTER
========================= */

export function formatApiRequests(value) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return "0";
  }

  return formatCompactNumber(numberValue);
}


/* =========================
   MRR FORMATTER
========================= */

export function formatMRR(value) {
  return formatCurrency(value);
}


/* =========================
   ARPU FORMATTER
========================= */

export function formatARPU(value) {
  return formatCurrency(value);
}