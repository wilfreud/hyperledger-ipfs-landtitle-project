import { Router } from 'express';
import {
    createLandTitle,
    getLandTitle,
    updateLandTitle,
    transferLandTitle,
    getAllLandTitles
} from '../controllers/landTitleController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Land Titles
 *   description: API for managing land titles using Hyperledger Fabric and IPFS
 */

/**
 * @swagger
 * /api/landtitles:
 *   post:
 *     summary: Create a new land title
 *     tags: [Land Titles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - owner
 *               - description
 *               - value
 *               - document
 *               - timestamp
 *             properties:
 *               id:
 *                 type: string
 *                 example: LAND123
 *               owner:
 *                 type: string
 *                 example: Alice
 *               description:
 *                 type: string
 *                 example: Beachfront villa 2500sqft
 *               value:
 *                 type: number
 *                 example: 750000
 *               document:
 *                 type: string
 *                 format: base64
 *                 example: BASE64_ENCODED_PDF
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-03-15T12:00:00Z
 *     responses:
 *       201:
 *         description: Land title created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 txId:
 *                   type: string
 *                   example: abc123
 *                 cid:
 *                   type: string
 *                   example: Qm123
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/', createLandTitle);

/**
 * @swagger
 * /api/landtitles/{id}:
 *   get:
 *     summary: Get a land title by ID
 *     tags: [Land Titles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         example: LAND123
 *     responses:
 *       200:
 *         description: Land title details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LandTitle'
 *       404:
 *         description: Land title not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getLandTitle);

/**
 * @swagger
 * /api/landtitles/{id}:
 *   put:
 *     summary: Update a land title
 *     tags: [Land Titles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         example: LAND123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newOwner
 *               - newValue
 *             properties:
 *               newOwner:
 *                 type: string
 *                 example: Bob
 *               newValue:
 *                 type: number
 *                 example: 800000
 *     responses:
 *       200:
 *         description: Land title updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 txId:
 *                   type: string
 *                   example: def456
 *                 message:
 *                   type: string
 *                   example: Land title updated
 *       404:
 *         description: Land title not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateLandTitle);

/**
 * @swagger
 * /api/landtitles/{id}/transfer:
 *   post:
 *     summary: Transfer a land title to a new owner and organization
 *     tags: [Land Titles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         example: LAND123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newOwner
 *               - newOrg
 *             properties:
 *               newOwner:
 *                 type: string
 *                 example: Charlie
 *               newOrg:
 *                 type: string
 *                 example: Org2MSP
 *     responses:
 *       200:
 *         description: Land title transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 txId:
 *                   type: string
 *                   example: ghi789
 *                 message:
 *                   type: string
 *                   example: Land title transferred
 *       404:
 *         description: Land title not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/transfer', transferLandTitle);

/**
 * @swagger
 * /api/landtitles:
 *   get:
 *     summary: Get all land titles
 *     tags: [Land Titles]
 *     responses:
 *       200:
 *         description: List of all land titles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LandTitle'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllLandTitles);

export default router;