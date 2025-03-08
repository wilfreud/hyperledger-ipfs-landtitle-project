import { connect, Contract, Gateway, Hash } from '@hyperledger/fabric-gateway';
import { config } from '../config/index.js';
import { newGrpcConnection, newIdentity, newSigner } from '../auth/authService.js';

let gateway: Gateway;

export const getContract = async (): Promise<Contract> => {
  if (!gateway) {
    const client = await newGrpcConnection();
    gateway = connect({
      client,
      identity: await newIdentity(),
      signer: await newSigner(),
      // hash: 'SHA2' as Hash, // Critical security fix
    });
  }

  const network = gateway.getNetwork(config.CHANNEL_NAME);
  return network.getContract(config.CHAINCODE_NAME);
};