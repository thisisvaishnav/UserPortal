const API_URL = 'http://localhost:3000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      mode: 'cors',
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'An error occurred' };
    }

    return { data };
  } catch (error) {
    console.error('API request failed:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// Auth related functions
export const signUp = (username: string, password: string) => 
  apiRequest<{ token: string, message: string }>('/users/signup', 'POST', { username, password });

export const login = (username: string, password: string) => 
  apiRequest<{ token: string, message: string }>('/users/login', 'POST', { username, password });

export const getCourses = (token: string) => 
  apiRequest<{ courses: any[] }>('/courses', 'GET', undefined, token);

export const purchaseCourse = (courseId: string, token: string) => 
  apiRequest<{ message: string }>(`/users/courses/${courseId}`, 'POST', {}, token);

export const getPurchasedCourses = (token: string) => 
  apiRequest<{ purchasedCourse: any }>('/users/courses', 'GET', undefined, token); 