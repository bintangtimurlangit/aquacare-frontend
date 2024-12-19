import { useState } from 'react';
import { AxiosResponse, AxiosError } from 'axios';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const request = async (apiFunc: () => Promise<AxiosResponse<T>>) => {
    setState({ ...state, loading: true, error: null });
    try {
      const response = await apiFunc();
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error || 'An unexpected error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return {
    ...state,
    request,
  };
}
