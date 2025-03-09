// Ajouter CustomEvent pour éviter l'erreur ReferenceError: CustomEvent is not defined
globalThis.CustomEvent = globalThis.CustomEvent || class CustomEvent<T> extends Event {
    detail: T;
    constructor(type: string, eventInitDict?: CustomEventInit<T>) {
        super(type, eventInitDict);
        this.detail = eventInitDict?.detail || ({} as T);
    }
};

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
    console.log('Initializing Helia client...');
    await initHeliaClient();
    console.log('Helia client initialized.');

    console.log('Creating UnixFS instance...');
    const fs = unixfs(helia!);
    console.log('UnixFS instance created.');

    console.log('Adding document to IPFS...');
    const cid = await fs.addBytes(document);
    console.log(`Document uploaded to IPFS with CID: ${cid}`);

    console.log('Pinning the CID for persistence...');
    await helia!.pins.add(cid);
    console.log('CID pinned.');

    return cid.toString();
};

