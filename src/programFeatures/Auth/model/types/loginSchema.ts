export interface LoginSchema {
  userName: string;
  password: string;
  isLoading: boolean;
  error?: string;
}
