import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and JWT token generation
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and generate JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: adminpw
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Internal server error
 */
const loginController = async (req: Request, res: Response) => {
    // In production, use proper user authentication
    const { username, password } = req.body;

    // Simple demo authentication
    if (username === 'admin' && password === 'adminpw') {
        const token = jwt.sign(
            { sub: username, org: config.MSP_ID },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
        return;
    }

    res.status(401).json({ error: 'Invalid credentials' });
};

router.post('/login', loginController);

export default router;