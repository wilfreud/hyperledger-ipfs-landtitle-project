import { Router } from 'express';
import { createLandTitle } from '../controllers/landTitleController';

const router = Router();

router.post('/', createLandTitle);

export default router;
