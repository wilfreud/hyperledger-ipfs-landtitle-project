import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';

let helia: Awaited<ReturnType<typeof createHelia>>;

const initHeliaClient = async () => {
    if (!helia) {
        helia = await createHelia();
    }

    return helia;
};

export const uploadToIPFS = async (document: Buffer): Promise<string> => {
    if (!helia) await initHeliaClient();

    const fs = unixfs(helia!);
    const cid = await fs.addBytes(document);

    // Pin the CID for persistence
    await helia!.pins.add(cid);

    return cid.toString();
};
