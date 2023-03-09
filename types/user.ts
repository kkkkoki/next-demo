export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  birthdate: string;
  gender: 'female' | 'male' | 'other';
  createdAt: number;
  updatedAt: number | null;
}