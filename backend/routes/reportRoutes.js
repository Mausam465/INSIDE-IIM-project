import express from 'express';
import {
  generateReport,
  getReports,
  getReportById,
  deleteReport
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all endpoints below
router.use(protect);

router.route('/')
  .post(generateReport)
  .get(getReports);

router.route('/:id')
  .get(getReportById)
  .delete(deleteReport);

export default router;
