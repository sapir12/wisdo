import { Router } from 'express';
import * as feedController from '../controllers/feed.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', feedController.getFeed);

export default router;
