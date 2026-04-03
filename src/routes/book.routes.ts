import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/', bookController.createBook);
router.get('/', bookController.listBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;
