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
  displayName?: string;
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
  tags?: string[];
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
export type AlcoholPreference = 'Drinks' | 'WineOnly' | 'BeerOnly' | 'NonDrinker';

export interface QuestionnaireMyResponse {
  guestId: string;
  alcoholPreference: AlcoholPreference;
  hasAllergy: boolean;
  allergyNotes: string | null;
  submittedAt: string;
}

export interface QuestionnaireAdminResponse {
  guestId: string;
  guestName: string;
  alcoholPreference: AlcoholPreference;
  hasAllergy: boolean;
  allergyNotes: string | null;
  submittedAt: string;
}

export interface QuestionnaireNotSubmittedGuest {
  guestId: string;
  guestName: string;
}

export interface QuestionnaireAllData {
  totalGuests: number;
  submitted: number;
  responses: QuestionnaireAdminResponse[];
  notSubmitted: QuestionnaireNotSubmittedGuest[];
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

export interface SongRequestPage {
  items: SongRequest[];
  total: number;
  page: number;
  pageSize: number;
}

// Guests
export interface GuestDto {
  id: string;
  fullName: string;
  side: string;
  isChild: boolean;
  ageAtWedding: number | null;
  category: string;
  guestType: string;
  isConfirmed: boolean;
  hasQuestionnaire: boolean;
}

// Bingo
export interface BingoChallengeDto {
  id: string;
  title: string;
  description: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface BingoChallengeWithProgress {
  challengeId: string;
  title: string;
  description: string | null;
  displayOrder: number;
  isCompleted: boolean;
  photoUrl: string | null;
  completedAt: string | null;
}

// Photos
export interface GuestPhoto {
  id: string;
  guestId: string;
  guestName: string;
  url: string;
  fileSizeBytes: number;
  uploadedAt: string;
}

// Seating
export interface MySeating {
  tableNumber: number;
  tableName: string | null;
  seatNote: string | null;
  tablemates: string[];
}

export interface SeatingAssignment {
  guestId: string;
  guestName: string;
  tableNumber: number;
  tableName: string | null;
  seatNote: string | null;
}

// Thank you
export interface ThankYouMessage {
  guestId: string;
  guestName: string;
  message: string;
  photoUrl: string | null;
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
