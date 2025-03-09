/**
 * @swagger
 * components:
 *   schemas:
 *     LandTitle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: LAND123
 *         owner:
 *           type: string
 *           example: Alice
 *         description:
 *           type: string
 *           example: Beachfront villa 2500sqft
 *         value:
 *           type: number
 *           example: 750000
 *         documentHash:
 *           type: string
 *           example: Qm123
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: 2024-03-15T12:00:00Z
 *         organization:
 *           type: string
 *           example: Org1MSP
 */
export interface LandTitle {
    id: string;
    owner: string;
    description: string;
    value: number;
    documentHash: string;
    timestamp: string;
    organization: string;
}