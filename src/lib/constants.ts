export const LIBRARY_SLUG = import.meta.env.VITE_LIBRARY_SLUG || 'bhaiyaji';
export const LIBRARY_NAME = import.meta.env.VITE_LIBRARY_NAME || 'Bhaiya Ji Library';
export const LIBRARY_PLACE = import.meta.env.VITE_LIBRARY_PLACE || 'Awagarh';
export const IST_TIMEZONE = 'Asia/Kolkata';
export const CHECKIN_QR = JSON.stringify({ type: 'checkin', library: LIBRARY_SLUG });
export const CHECKOUT_QR = JSON.stringify({ type: 'checkout', library: LIBRARY_SLUG });

export const QUOTES = [
  'Discipline beats motivation when nobody is watching.',
  'Aaj ka ek focused hour, kal ka rank badal sakta hai.',
  'Consistency is the real shortcut.',
  'Library me shanti, result me kranti.',
  'Small daily wins become a big success story.'
];

export const BADGE_STREAKS = [7, 15, 30, 60, 90, 180, 365];
