export type ServerActionResponse<T> = {
  success: boolean;
  status: number;
  data: T;
  message?: string;
  error?: string;
};
