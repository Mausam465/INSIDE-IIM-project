import { validateCompanySearch } from '../validation/companyValidation.js';
import { searchCompanyInMarket } from '../services/companyService.js';

/**
 * @desc    Search for matching company profiles and tickers
 * @route   POST /api/company/search
 * @access  Private (JWT protected)
 */
export const searchCompany = async (req, res) => {
  try {
    // 1. Run Validation
    const validationError = validateCompanySearch(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: validationError
      });
    }

    const { companyName } = req.body;

    // 2. Query market search service
    const results = await searchCompanyInMarket(companyName);

    // 3. Return response
    return res.status(200).json({
      success: true,
      query: companyName.trim(),
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error(`SearchController Error: ${error.stack}`);
    return res.status(500).json({
      success: false,
      error: 'ServerError',
      message: 'An internal error occurred during the search processing. Please try again later.'
    });
  }
};
