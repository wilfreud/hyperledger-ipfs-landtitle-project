import { cleanEnv, str, num } from 'envalid';
import dotenv from 'dotenv'
dotenv.config({ path: '.env' });

export const config = cleanEnv(process.env, {
  JWT_SECRET: str(),
  CHANNEL_NAME: str(),
  CHAINCODE_NAME: str(),
  PEER_ENDPOINT: str(),
  MSP_ID: str(),
  KEY_DIRECTORY_PATH: str(),
  CERT_DIRECTORY_PATH: str(),
  TLS_CERT_PATH: str(),
  IPFS_API_URL: str(),
  PORT: num({ default: 6060 }),
  PEER_NAME_OVERRIDE: str({ default: 'peer0.org1.example.com' })
});