export type AuthProviderId = 'google.com' | 'apple.com';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: AuthProviderId;
  createdAt: unknown; // Firestore serverTimestamp
}
