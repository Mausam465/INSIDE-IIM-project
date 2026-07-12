/**
 * Validates request payload for company search.
 * @param {Object} body - Request body object
 * @returns {string|null} - Error message if invalid, otherwise null
 */
export const validateCompanySearch = (body) => {
  const { companyName } = body;

  if (companyName === undefined || companyName === null) {
    return 'Company name query parameter (companyName) is required.';
  }

  if (typeof companyName !== 'string') {
    return 'Company name must be a text string.';
  }

  if (companyName.trim().length === 0) {
    return 'Company name cannot be blank or whitespace.';
  }

  if (companyName.trim().length < 2) {
    return 'Search query is too short. Please provide at least 2 characters.';
  }

  return null;
};
