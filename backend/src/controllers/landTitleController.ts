import { z } from 'zod';
import { uploadToIPFS } from '../ipfs/ipfsService';
import { getContract } from '../chaincode/fabricGateway';
import { Request, Response } from 'express';

const LandTitleSchema = z.object({
    id: z.string().min(3),
    owner: z.string().regex(/^org\dMSP$/), // Match MSP format
    description: z.string().min(10),
    value: z.number().positive(),
    document: z.instanceof(Buffer),
    timestamp: z.string().datetime()
});

export const createLandTitle = async (req: Request, res: Response) => {
    try {
        const validated = LandTitleSchema.parse(req.body);
        const documentHash = await uploadToIPFS(validated.document);

        const contrakt = await getContract();
        const result = await contrakt.submitTransaction(
            'CreateLandTitle',
            validated.id,
            validated.owner,
            validated.description,
            validated.value.toString(),
            documentHash,
            validated.timestamp
        );

        console.log('result', result);
        console.log('result to string ', Buffer.from(result.toString()).toString('utf-8'))

        res.status(200).json({ cid: documentHash, txId: result });
        // res.status(200).json({ cid: documentHash, txId: result.getTransactionId() });
    } catch (error) {
        handleFabricError(error, res);
    }
};

const handleFabricError = (error: any, res: Response) => {
    if (error.endorsements) {
        return res.status(400).json({
            error: 'Chaincode rejection',
            details: error.endorsements.map((e: any) => e.message)
        });
    }
    res.status(500).json({ error: error.message });
};