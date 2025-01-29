import { AppError } from './base.service';

export class ApiService {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new AppError(
          `API request failed: ${response.statusText}`,
          'API_REQUEST_FAILED',
          { status: response.status }
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      throw new AppError(
        'API request failed',
        'API_REQUEST_FAILED',
        error
      );
    }
  }

  protected get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, headers);
  }

  protected post<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('POST', endpoint, data, headers);
  }

  protected put<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('PUT', endpoint, data, headers);
  }

  protected patch<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, headers);
  }

  protected delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, headers);
  }
} 