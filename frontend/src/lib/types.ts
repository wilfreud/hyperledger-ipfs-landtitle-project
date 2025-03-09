// API Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface LandTitle {
  ID: string;
  Owner: string;
  PropertyDescription: string;
  PropertyValue: number;
  document: string;
  Timestamp: string;
  Organization: string;
}

export interface CreateLandTitleRequest extends LandTitle { }

export interface UpdateLandTitleRequest {
  newOwner: string;
  newValue: number;
}

export interface TransferLandTitleRequest {
  newOwner: string;
  newOrg: string;
}

export interface ApiResponse {
  txId: string;
  message?: string;
  cid?: string;
}