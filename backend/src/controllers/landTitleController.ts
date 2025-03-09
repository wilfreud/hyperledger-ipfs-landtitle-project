import { Request, Response } from 'express';
import { getContract } from '../chaincode/fabricGateway.js';
import { uploadToIPFS } from '../ipfs/ipfsService.js';
import { z } from 'zod';

function parseFabricresponse(response: any) {
    return JSON.parse(Buffer.from(response).toString("utf-8"));
}

// Validation Schemas
const CreateLandTitleSchema = z.object({
    id: z.string().min(3),
    owner: z.string().min(3),
    description: z.string().min(10),
    value: z.number().positive(),
    document: z.string().transform(s => Buffer.from(s, 'base64')),
    timestamp: z.string().datetime()
});

const UpdateLandTitleSchema = z.object({
    newOwner: z.string().min(3),
    newValue: z.number().positive()
});

const TransferLandTitleSchema = z.object({
    newOwner: z.string().min(3),
    newOrg: z.string().regex(/^Org\dMSP$/)
});

export const createLandTitle = async (req: Request, res: Response) => {
    try {
        const validated = CreateLandTitleSchema.parse(req.body);
        const documentHash = await uploadToIPFS(validated.document);

        const contract = await getContract();
        const result = await contract.submitTransaction(
            'CreateLandTitle',
            validated.id,
            validated.owner,
            validated.description,
            validated.value.toString(),
            documentHash,
            validated.timestamp
        );

        res.status(201).json({
            // txId: parseFabricresponse(result).getTransactionId(),
            txId: parseFabricresponse(result),
            cid: documentHash
        });
    } catch (error) {
        handleFabricError(error, res);
    }
};

export const getLandTitle = async (req: Request, res: Response) => {
    try {
        const contract = await getContract();
        const result = await contract.evaluateTransaction(
            'ReadLandTitle',
            req.params.id
        );

        res.status(200).json(parseFabricresponse(result));
    } catch (error) {
        handleFabricError(error, res);
    }
};

export const updateLandTitle = async (req: Request, res: Response) => {
    try {
        const validated = UpdateLandTitleSchema.parse(req.body);
        const contract = await getContract();

        const result = await contract.submitTransaction(
            'UpdateLandTitle',
            req.params.id,
            validated.newOwner,
            validated.newValue.toString()
        );

        res.status(200).json({
            txId: parseFabricresponse(result),
            message: 'Land title updated'
        });
    } catch (error) {
        handleFabricError(error, res);
    }
};

export const transferLandTitle = async (req: Request, res: Response) => {
    try {
        const validated = TransferLandTitleSchema.parse(req.body);
        const contract = await getContract();

        const result = await contract.submitTransaction(
            'TransferLandTitle',
            req.params.id,
            validated.newOwner,
            validated.newOrg
        );

        console.log(result)
        res.status(200).json({
            txId: parseFabricresponse(result),
            message: 'Land title transferred'
        });
    } catch (error) {
        handleFabricError(error, res);
    }
};

export const getAllLandTitles = async (req: Request, res: Response) => {
    try {
        const contract = await getContract();
        const result = await contract.evaluateTransaction('GetAllLandTitles');
        console.log(Buffer.from(result).toString("utf-8"))

        res.status(200).json(parseFabricresponse(result));
    } catch (error) {
        handleFabricError(error, res);
    }
};

const handleFabricError = (error: any, res: Response) => {
    console.error(error)
    if (error.message.includes('does not exist')) {
        return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('access denied')) {
        return res.status(403).json({ error: 'Unauthorized operation' });
    }
    res.status(500).json({ error: error.message });
};