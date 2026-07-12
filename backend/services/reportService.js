import Report from '../models/Report.js';

/**
 * Saves a generated research report into MongoDB.
 * @param {ObjectId} userId - User reference ID
 * @param {Object} reportData - Object matching Mongoose Report model parameters
 * @returns {Promise<Object>} - The saved Report document
 */
export const saveReport = async (userId, reportData) => {
  try {
    const report = await Report.create({
      userId,
      ...reportData
    });
    return report;
  } catch (error) {
    console.error(`ReportService saveReport Error: ${error.message}`);
    throw new Error(`Failed to save report: ${error.message}`);
  }
};

/**
 * Gets historical reports for a specific user.
 * @param {ObjectId} userId - User reference ID
 * @returns {Promise<Array>} - List of saved reports sorted newest first
 */
export const getReportsHistory = async (userId) => {
  try {
    const reports = await Report.find({ userId }).sort({ createdDate: -1 });
    return reports;
  } catch (error) {
    console.error(`ReportService getReportsHistory Error: ${error.message}`);
    throw new Error(`Failed to fetch history: ${error.message}`);
  }
};

/**
 * Gets report details.
 * @param {ObjectId} reportId - Unique report identifier
 * @param {ObjectId} userId - Owner ID for security validation
 * @returns {Promise<Object|null>} - The matching report or null
 */
export const getReportById = async (reportId, userId) => {
  try {
    const report = await Report.findOne({ _id: reportId, userId });
    return report;
  } catch (error) {
    console.error(`ReportService getReportById Error: ${error.message}`);
    throw new Error(`Failed to fetch report details: ${error.message}`);
  }
};

/**
 * Deletes a historical report.
 * @param {ObjectId} reportId - Unique report identifier
 * @param {ObjectId} userId - Owner ID for authorization checks
 * @returns {Promise<Object|null>} - The deleted document or null
 */
export const deleteReport = async (reportId, userId) => {
  try {
    const deleted = await Report.findOneAndDelete({ _id: reportId, userId });
    return deleted;
  } catch (error) {
    console.error(`ReportService deleteReport Error: ${error.message}`);
    throw new Error(`Failed to delete report: ${error.message}`);
  }
};
