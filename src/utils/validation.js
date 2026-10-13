/* =========================
   EMAIL VALIDATION
========================= */

export function validateEmail(email) {
  if (!email) {
    return false;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}


/* =========================
   PHONE VALIDATION
========================= */

export function validatePhone(phone) {
  if (!phone) {
    return false;
  }

  const phonePattern = /^\+?[0-9\s()-]{7,20}$/;

  return phonePattern.test(phone);
}


/* =========================
   REQUIRED FIELD
========================= */

export function validateRequired(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return false;
  }

  return true;
}


/* =========================
   POSITIVE NUMBER
========================= */

export function validatePositiveNumber(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return false;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return false;
  }

  return numberValue > 0;
}


/* =========================
   NON NEGATIVE NUMBER
========================= */

export function validateNonNegativeNumber(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return false;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return false;
  }

  return numberValue >= 0;
}


/* =========================
   PASSWORD VALIDATION
========================= */

export function validatePassword(password) {
  if (!password) {
    return false;
  }

  return password.length >= 6;
}


/* =========================
   NAME VALIDATION
========================= */

export function validateName(name) {
  if (!name) {
    return false;
  }

  const namePattern = /^[A-Za-z\s]+$/;

  return namePattern.test(name);
}


/* =========================
   DATE VALIDATION
========================= */

export function validateDate(date) {
  if (!date) {
    return false;
  }

  const dateValue = new Date(date);

  return !Number.isNaN(dateValue.getTime());
}


/* =========================
   DATE RANGE VALIDATION
========================= */

export function validateDateRange(
  startDate,
  endDate
) {
  if (!startDate || !endDate) {
    return false;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return false;
  }

  return start <= end;
}


/* =========================
   USER FORM VALIDATION
========================= */

export function validateUserForm(formData) {
  const errors = {};

  if (!validateRequired(formData.name)) {
    errors.name = "Name is required.";
  } else if (!validateName(formData.name)) {
    errors.name =
      "Name should contain only letters.";
  }

  if (!validateRequired(formData.email)) {
    errors.email = "Email is required.";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!validateRequired(formData.company)) {
    errors.company = "Company is required.";
  }

  if (!validateRequired(formData.role)) {
    errors.role = "Role is required.";
  }

  if (!validateRequired(formData.plan)) {
    errors.plan = "Plan is required.";
  }

  if (!validateRequired(formData.status)) {
    errors.status = "Status is required.";
  }

  if (!validateRequired(formData.country)) {
    errors.country = "Country is required.";
  }

  return errors;
}


/* =========================
   CUSTOMER FORM VALIDATION
========================= */

export function validateCustomerForm(
  formData
) {
  const errors = {};

  if (!validateRequired(formData.company)) {
    errors.company = "Company is required.";
  }

  if (!validateRequired(formData.contactName)) {
    errors.contactName =
      "Contact name is required.";
  } else if (
    !validateName(formData.contactName)
  ) {
    errors.contactName =
      "Enter a valid contact name.";
  }

  if (!validateRequired(formData.email)) {
    errors.email = "Email is required.";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!validateRequired(formData.phone)) {
    errors.phone = "Phone number is required.";
  } else if (!validatePhone(formData.phone)) {
    errors.phone =
      "Phone number must contain 10 digits.";
  }

  if (!validateRequired(formData.country)) {
    errors.country = "Country is required.";
  }

  if (!validateRequired(formData.plan)) {
    errors.plan = "Plan is required.";
  }

  if (
    formData.users !== undefined &&
    formData.users !== ""
  ) {
    if (
      !validateNonNegativeNumber(
        formData.users
      )
    ) {
      errors.users =
        "Users must be a valid number.";
    }
  }

  if (
    formData.mrr !== undefined &&
    formData.mrr !== ""
  ) {
    if (
      !validateNonNegativeNumber(
        formData.mrr
      )
    ) {
      errors.mrr =
        "MRR must be a valid number.";
    }
  }

  return errors;
}


/* =========================
   PLAN FORM VALIDATION
========================= */

export function validatePlanForm(formData) {
  const errors = {};

  // Plan Name
  if (
    !formData.name ||
    formData.name.trim() === ""
  ) {
    errors.name = "Plan name is required.";
  }

  // Description
  if (
    !formData.description ||
    formData.description.trim() === ""
  ) {
    errors.description = "Description is required.";
  }

  // Monthly Price
  if (
    formData.monthlyPrice === "" ||
    formData.monthlyPrice === null ||
    formData.monthlyPrice === undefined ||
    !Number.isFinite(Number(formData.monthlyPrice)) ||
    Number(formData.monthlyPrice) < 0
  ) {
    errors.monthlyPrice = "Enter a valid monthly price.";
  }

  // Yearly Price
  if (
    formData.yearlyPrice === "" ||
    formData.yearlyPrice === null ||
    formData.yearlyPrice === undefined ||
    !Number.isFinite(Number(formData.yearlyPrice)) ||
    Number(formData.yearlyPrice) < 0
  ) {
    errors.yearlyPrice = "Enter a valid yearly price.";
  }

  // Trial Days
  if (
    formData.trialDays === "" ||
    formData.trialDays === null ||
    formData.trialDays === undefined ||
    !Number.isFinite(Number(formData.trialDays)) ||
    Number(formData.trialDays) < 0
  ) {
    errors.trialDays = "Enter a valid trial period.";
  }

  // User Limit: empty means Unlimited
  if (
    formData.userLimit !== "" &&
    formData.userLimit !== null &&
    formData.userLimit !== undefined &&
    (
      !Number.isFinite(Number(formData.userLimit)) ||
      Number(formData.userLimit) < 1
    )
  ) {
    errors.userLimit = "User limit must be at least 1.";
  }

  // API Limit: empty means Unlimited
  if (
    formData.apiLimit !== "" &&
    formData.apiLimit !== null &&
    formData.apiLimit !== undefined &&
    (
      !Number.isFinite(Number(formData.apiLimit)) ||
      Number(formData.apiLimit) < 1
    )
  ) {
    errors.apiLimit = "API limit must be at least 1.";
  }

  // Status
  if (!formData.status) {
    errors.status = "Please select a status.";
  }

  // Features are optional.
  // Do not add errors.features here.

  return errors;
}



/* =========================
   SUBSCRIPTION VALIDATION
========================= */

export function validateSubscriptionForm(
  formData
) {
  const errors = {};

  if (!validateRequired(formData.customerId)) {
    errors.customerId =
      "Customer is required.";
  }

  if (!validateRequired(formData.customer)) {
    errors.customer =
      "Customer name is required.";
  }

  if (!validateRequired(formData.plan)) {
    errors.plan = "Plan is required.";
  }

  if (!validateRequired(formData.billingCycle)) {
    errors.billingCycle =
      "Billing cycle is required.";
  }

  if (!validateNonNegativeNumber(formData.amount)) {
    errors.amount =
      "Enter a valid subscription amount.";
  }

  if (!validateRequired(formData.status)) {
    errors.status =
      "Subscription status is required.";
  }

  if (!validateDate(formData.startDate)) {
    errors.startDate =
      "Start date is required.";
  }

  if (!validateDate(formData.renewalDate)) {
    errors.renewalDate =
      "Renewal date is required.";
  }

  if (
    formData.startDate &&
    formData.renewalDate
  ) {
    if (
      !validateDateRange(
        formData.startDate,
        formData.renewalDate
      )
    ) {
      errors.renewalDate =
        "Renewal date must be after start date.";
    }
  }

  if (!validateRequired(formData.paymentStatus)) {
    errors.paymentStatus =
      "Payment status is required.";
  }

  return errors;
}


/* =========================
   PAYMENT VALIDATION
========================= */

export function validatePaymentForm(
  formData
) {
  const errors = {};

  if (!validateRequired(formData.customer)) {
    errors.customer =
      "Customer is required.";
  }

  if (!validateRequired(formData.plan)) {
    errors.plan = "Plan is required.";
  }

  if (!validateNonNegativeNumber(formData.amount)) {
    errors.amount =
      "Enter a valid payment amount.";
  }

  if (!validateRequired(formData.method)) {
    errors.method =
      "Payment method is required.";
  }

  if (!validateRequired(formData.status)) {
    errors.status =
      "Payment status is required.";
  }

  if (!validateRequired(formData.transactionId)) {
    errors.transactionId =
      "Transaction ID is required.";
  }

  if (!validateDate(formData.date)) {
    errors.date = "Payment date is required.";
  }

  return errors;
}


/* =========================
   LOGIN VALIDATION
========================= */

export function validateLoginForm(formData) {
  const errors = {};

  if (!validateRequired(formData.email)) {
    errors.email = "Email is required.";
  } else if (!validateEmail(formData.email)) {
    errors.email =
      "Enter a valid email address.";
  }

  if (!validateRequired(formData.password)) {
    errors.password =
      "Password is required.";
  } else if (
    !validatePassword(formData.password)
  ) {
    errors.password =
      "Password must contain at least 6 characters.";
  }

  return errors;
}


/* =========================
   CHECK FORM ERRORS
========================= */

export function hasValidationErrors(errors) {
  const errorKeys = Object.keys(errors);

  return errorKeys.length > 0;
}