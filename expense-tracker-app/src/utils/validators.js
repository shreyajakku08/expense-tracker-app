// ========================================
// VALIDATION UTILITIES
// ========================================

/**
 * Validate that a value is not empty
 * @param {string} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
};

/**
 * Validate that a value is a valid positive number
 * @param {string|number} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export const validateAmount = (value, fieldName = 'Amount') => {
  const num = Number(value);
  if (value === '' || value === null || value === undefined) {
    return { valid: false, message: `${fieldName} is required` };
  }
  if (isNaN(num)) {
    return { valid: false, message: `${fieldName} must be a number` };
  }
  if (num <= 0) {
    return { valid: false, message: `${fieldName} must be greater than 0` };
  }
  if (num > 99999999) {
    return { valid: false, message: `${fieldName} is too large` };
  }
  return { valid: true, message: '' };
};

/**
 * Validate login credentials
 * @param {string} userId
 * @param {string} password
 * @returns {{ valid: boolean, errors: { userId?: string, password?: string } }}
 */
export const validateLogin = (userId, password) => {
  const errors = {};

  if (!userId || userId.trim() === '') {
    errors.userId = 'User ID is required';
  } else if (userId.trim().length < 3) {
    errors.userId = 'User ID must be at least 3 characters';
  }

  if (!password || password.trim() === '') {
    errors.password = 'Password is required';
  } else if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate profile fields
 * @param {object} profile
 * @returns {{ valid: boolean, errors: object }}
 */
export const validateProfile = (profile) => {
  const errors = {};

  if (!profile.name || profile.name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (profile.contact && !/^\d{10}$/.test(profile.contact.replace(/\s/g, ''))) {
    errors.contact = 'Enter a valid 10-digit number';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate a transaction form
 * @param {object} transaction
 * @returns {{ valid: boolean, errors: object }}
 */
export const validateTransaction = (transaction) => {
  const errors = {};

  const typeCheck = validateRequired(transaction.type, 'Type');
  if (!typeCheck.valid) errors.type = typeCheck.message;

  const categoryCheck = validateRequired(transaction.category, 'Category');
  if (!categoryCheck.valid) errors.category = categoryCheck.message;

  const descCheck = validateRequired(transaction.description, 'Description');
  if (!descCheck.valid) errors.description = descCheck.message;

  const amountCheck = validateAmount(transaction.amount, 'Amount');
  if (!amountCheck.valid) errors.amount = amountCheck.message;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
