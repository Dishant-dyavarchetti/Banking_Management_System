import type { AccountType, User } from '@/types';

export interface RegistrationInput {
  name: string;
  email: string;
  phone: string;
  accountType: AccountType;
  password: string;
  pin: string;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json() as T & { message?: string };

  if (!response.ok) {
    throw new Error(result.message || 'The request could not be completed.');
  }

  return result;
}

export interface RegisterResponse {
  message: string,
  accountNumber: string
}

export async function registerCustomer(input: RegistrationInput): Promise<RegisterResponse> {
  const result = await post<RegisterResponse>('register', input);
  return result;
}

export async function authenticateCustomer(email: string, password: string): Promise<User> {
  const result = await post<{ customer: User }>('login', { email, password });
  return result.customer;
}