import express from 'express';
import { searchCompany } from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication validation to search route
router.post('/search', protect, searchCompany);

export default router;
