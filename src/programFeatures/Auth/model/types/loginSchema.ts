export interface LoginSchema {
  userName: string;
  password: string;
  passwordConfirm: string;
  name: string;
  isLoading: boolean;
  error?: string;
}
