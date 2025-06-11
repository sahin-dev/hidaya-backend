export const PRAYER_NAMES = {
  FAJR: 'Fajr',
  DHUHR: 'Dhuhr',
  ASR: 'Asr',
  MAGHRIB: 'Maghrib',
  ISHA: 'Isha',
} as const;

export type TPrayer = (typeof PRAYER_NAMES)[keyof typeof PRAYER_NAMES];
