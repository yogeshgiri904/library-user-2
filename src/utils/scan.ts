import { LIBRARY_SLUG } from '../lib/constants';
import type { ScanPayload, ScanType } from '../types';

export function parseScanPayload(raw: string): ScanPayload {
  let payload: unknown;

  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error('Invalid QR. Please scan Bhaiya Ji Library QR only.');
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid QR payload.');
  }

  const item = payload as Record<string, unknown>;

  if (item.library !== LIBRARY_SLUG) {
    throw new Error('This QR is not for your library.');
  }

  if (item.type !== 'checkin' && item.type !== 'checkout') {
    throw new Error('QR type must be checkin or checkout.');
  }

  return {
    type: item.type as ScanType,
    library: item.library as string
  };
}