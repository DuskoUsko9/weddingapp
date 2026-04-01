// API response wrapper
export interface ApiResponse<T> {
  data: T;
  error: string | null;
}

// Auth
export type UserRole = 'Guest' | 'Admin' | 'DJ' | 'MasterOfCeremony';

export interface AuthUser {
  guestId: string | null;
  guestName: string;
  role: UserRole;
  token: string;
}

export interface LoginResponse {
  type: 'token' | 'disambiguation';
  token?: string;
  role?: UserRole;
  guestId?: string;
  guestName?: string;
  matches?: GuestMatch[];
}

export interface GuestMatch {
  guestId: string;
  fullName: string;
  category: string;
  side: string;
}

// Feature flags
export interface FeatureFlag {
  key: string;
  isEnabled: boolean;
  isManuallyEnabled: boolean;
  isManuallyDisabled: boolean;
  availableFrom: string | null;
  availableUntil: string | null;
}

// Schedule
export interface ScheduleItem {
  id: string;
  timeLabel: string;
  timeMinutes: number;
  title: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
}

// Menu
export interface MenuItem {
  id: string;
  sectionId: string;
  name: string;
  description: string | null;
  displayOrder: number;
}

export interface MenuSection {
  id: string;
  name: string;
  displayOrder: number;
  items: MenuItem[];
}

// Love story
export interface LoveStoryEvent {
  id: string;
  eventDate: string;
  title: string;
  description: string | null;
  displayOrder: number;
}

// Static content
export interface StaticContent {
  key: string;
  title: string;
  content: string;
  metadata: string | null;
}

// Questionnaire
export interface QuestionnaireResponse {
  id: string;
  guestId: string;
  guestName: string;
  isAttending: boolean;
  mealChoice: string | null;
  allergies: string | null;
  note: string | null;
  submittedAt: string;
}

// Song requests
export type SongRequestStatus = 'Pending' | 'Played' | 'Skipped';

export interface SongRequest {
  id: string;
  guestId: string;
  guestName: string;
  songName: string;
  artist: string | null;
  dedication: string | null;
  status: SongRequestStatus;
  createdAt: string;
}

// Admin stats
export interface AdminStats {
  totalGuests: number;
  confirmedGuests: number;
  attending: number;
  notAttending: number;
  pendingQuestionnaire: number;
  totalSongRequests: number;
  pendingSongRequests: number;
}
