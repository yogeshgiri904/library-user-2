export type MembershipStatus = 'active' | 'expired' | 'blocked';
export type AttendanceStatus = 'checked_in' | 'checked_out';
export type ScanType = 'checkin' | 'checkout';

export interface Student {
  id: string;
  auth_user_id: string;
  library_id: string;
  full_name: string;
  photo_url: string | null;
  seat_no: string | null;
  phone: string | null;
  join_date: string;
  renewal_date: string;
  membership_status: MembershipStatus;
  current_streak: number;
  longest_streak: number;
  monthly_streak: number;
  points: number;
  referral_code: string;
  created_at: string;
}

export interface AttendanceRow {
  id: string;
  student_id: string;
  study_date: string;
  checkin_time: string | null;
  checkout_time: string | null;
  duration_minutes: number;
  status: AttendanceStatus;
  checkout_reason?: string | null;
  created_at?: string;
}

export interface BadgeRow {
  id: string;
  code: string;
  title: string;
  description: string | null;
  icon: string;
  required_streak_days: number | null;
  color: string | null;
}

export interface StudentBadgeRow {
  id: string;
  badge_id: string;
  earned_at: string;
  badges?: BadgeRow;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: 'holiday' | 'event' | 'mock_test' | 'fee' | 'notice';
  priority: number;
  published_at: string;
}

export interface SuccessWallItem {
  id: string;
  student_name: string;
  photo_url: string;
  achievement: string;
  testimonial: string;
  exam_name: string;
  year: number;
  likes: number;
}

export interface Referral {
  id: string;
  referrer_student_id: string;
  referred_name: string;
  referred_phone: string | null;
  reward_status: 'pending' | 'earned' | 'rejected';
  reward_amount: number;
  created_at: string;
}

export interface LeaderboardEntry {
  student_id: string;
  full_name: string;
  photo_url: string | null;
  seat_no: string | null;
  study_minutes: number;
  attendance_days: number;
  current_streak: number;
  points: number;
  referrals: number;
  rank: number;
}

export interface ScanPayload {
  type: ScanType;
  library: string;
}
