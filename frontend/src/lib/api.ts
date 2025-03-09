import { LoginRequest, CreateLandTitleRequest, UpdateLandTitleRequest, TransferLandTitleRequest } from './types';

const API_URL = 'http://localhost:6060';

export async function login(credentials: LoginRequest) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function getLandTitles() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/landtitles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch land titles');
  }

  return response.json();
}

export async function getLandTitle(id: string) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/landtitles/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch land title');
  }

  return response.json();
}

export async function createLandTitle(data: CreateLandTitleRequest) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/landtitles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create land title');
  }

  return response.json();
}

export async function updateLandTitle(id: string, data: UpdateLandTitleRequest) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/landtitles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update land title');
  }

  return response.json();
}

export async function transferLandTitle(id: string, data: TransferLandTitleRequest) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/landtitles/${id}/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to transfer land title');
  }

  return response.json();
}