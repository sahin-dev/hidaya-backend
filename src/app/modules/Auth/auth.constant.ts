export const ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type TRole = keyof typeof ROLE;

export const PROVIDER = {
  GOOGLE: 'GOOGLE',
  FACEBOOK: 'FACEBOOK',
  APPLE: 'APPLE',
} as const;

export type TProvider = keyof typeof ROLE;
