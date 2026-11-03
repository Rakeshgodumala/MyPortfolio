import { Router } from 'express';
import * as certifications from '../controllers/certificationController.js';
import * as contact from '../controllers/contactController.js';
import * as projects from '../controllers/projectController.js';
import { health } from '../controllers/systemController.js';
import { contactLimiter } from '../middleware/security.js';

const router = Router();

router.get('/health', health);
router.get('/projects', projects.listPublished);
router.get('/projects/:slug', projects.getPublishedBySlug);
router.get('/certifications', certifications.list);
router.post('/contact', contactLimiter, contact.submit);

export default router;
