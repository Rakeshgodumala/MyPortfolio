import { Router } from 'express';
import * as certifications from '../controllers/certificationController.js';
import * as contact from '../controllers/contactController.js';
import * as projects from '../controllers/projectController.js';
import { status } from '../controllers/systemController.js';
import { uploadImage } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/auth.js';
import { imageUpload } from '../middleware/upload.js';

const router = Router();

// Every route below requires a valid admin session, checked on the server for each request.
router.use(requireAuth);

router.get('/status', status);

router.get('/projects', projects.listAll);
router.post('/projects', projects.create);
router.put('/projects/reorder', projects.reorder);
router.get('/projects/:id', projects.getById);
router.put('/projects/:id', projects.update);
router.patch('/projects/:id/publish', projects.setPublished);
router.delete('/projects/:id', projects.remove);

router.post('/uploads', imageUpload, uploadImage);

router.get('/certifications', certifications.list);
router.post('/certifications', certifications.create);
router.put('/certifications/:id', certifications.update);
router.delete('/certifications/:id', certifications.remove);

router.get('/messages', contact.list);
router.patch('/messages/:id/read', contact.setRead);
router.delete('/messages/:id', contact.remove);

export default router;
