export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  birthday: string;
  gender: 'female' | 'male' | 'other';
  createdAt: number;
  updatedAt: number | null;
};
