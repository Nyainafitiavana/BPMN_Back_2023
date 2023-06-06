export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: DataApiResponse;
}

export interface DataApiResponse {
  totalRows?: number;
  limit?: number;
  page?: number;
  rows?: object[] | object;
}
