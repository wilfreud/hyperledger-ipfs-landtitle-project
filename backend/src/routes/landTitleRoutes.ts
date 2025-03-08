import { Router } from 'express';
import { createLandTitle } from '../controllers/landTitleController.js';

const router = Router();

router.post('/', createLandTitle);

export default router;
