import { config } from '../config';
import { connect, Contract, Identity, Signer } from '@hyperledger/fabric-gateway';
import { promises as fs } from 'fs';
import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { signers } from '@hyperledger/fabric-gateway';
import crypto from 'crypto';

// Enhanced Type Safety
interface FabricIdentity extends Identity {
  mspId: string;
  credentials: Buffer;
}

export const newGrpcConnection = async (): Promise<grpc.Client> => {
  try {
    const tlsRootCert = await fs.readFile(config.TLS_CERT_PATH);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);

    return new grpc.Client(
      config.PEER_ENDPOINT,
      tlsCredentials,
      {
        'grpc.ssl_target_name_override': config.PEER_NAME_OVERRIDE // Added to config
      }
    );
  } catch (error) {
    throw new Error(`gRPC connection failed: ${error}`);
  }
};

export const newIdentity = async (): Promise<FabricIdentity> => {
  try {
    const certFile = await findFileByPattern(config.CERT_DIRECTORY_PATH, /\.pem$/);
    const credentials = await fs.readFile(certFile);

    return {
      mspId: config.MSP_ID,
      credentials
    };
  } catch (error) {
    throw new Error(`Identity initialization failed: ${error}`);
  }
};

export const newSigner = async (): Promise<Signer> => {
  try {
    const keyFile = await findFileByPattern(config.KEY_DIRECTORY_PATH, /_sk$/);
    const privateKeyPem = await fs.readFile(keyFile);
    const privateKey = crypto.createPrivateKey(privateKeyPem);

    return signers.newPrivateKeySigner(privateKey);
  } catch (error) {
    throw new Error(`Signer initialization failed: ${error}`);
  }
};

// Improved file discovery with pattern matching
const findFileByPattern = async (dirPath: string, pattern: RegExp): Promise<string> => {
  try {
    const files = await fs.readdir(dirPath);
    const matchedFile = files.find(file => pattern.test(file));

    if (!matchedFile) {
      throw new Error(`No files matching pattern ${pattern} in ${dirPath}`);
    }

    return path.join(dirPath, matchedFile);
  } catch (error) {
    throw new Error(`File discovery failed: ${error}`);
  }
};