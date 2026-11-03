import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/security.js';

// There is deliberately no registration route: admins are created with `npm run create-admin`.
const router = Router();

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
