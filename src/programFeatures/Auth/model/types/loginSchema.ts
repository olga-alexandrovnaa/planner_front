export interface LoginSchema {
  userName: string;
  password: string;
  name: string;
  passwordConfirm: string;
  isLoading: boolean;
  error?: string;
}
