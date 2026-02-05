import { createAuthClient } from 'better-auth/react';
import { BACKEND_BASE_URL, USER_ROLES } from '../constants/index.ts';

// Patch: always send credentials (cookies) with requests
const fetchWithCredentials = (input: RequestInfo, init: RequestInit = {}) => {
  return fetch(input, { ...init, credentials: 'include' });
};

export const authClient = createAuthClient({
  baseURL: BACKEND_BASE_URL.endsWith('/') ? BACKEND_BASE_URL.slice(0, -1) : BACKEND_BASE_URL,
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'student',
        input: true,
      },
      departmentId: {
        type: 'number',
        required: false,
        input: true,
      },
      imageCldPubId: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
  fetch: fetchWithCredentials,
});
