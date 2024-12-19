// Generic API response type
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Error response from backend
export interface ApiError {
    error: string;
    message?: string;
    statusCode?: number;
}
