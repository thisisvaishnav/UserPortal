const API_BASE_URL = 'http://localhost:3000';

interface AuthResponse {
  message: string;
  token: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  duration: string;
  level: string;
}

interface CoursesResponse {
  success: boolean;
  data?: Course[];
  message?: string;
}

interface CourseResponse {
  success: boolean;
  data?: Course;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  async signup(username: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getCourses(): Promise<CoursesResponse> {
    return this.request<CoursesResponse>('/courses');
  }

  async getCourse(id: string): Promise<CourseResponse> {
    return this.request<CourseResponse>(`/courses/${id}`);
  }

  async createCourse(course: Omit<Course, 'id'>): Promise<CourseResponse> {
    return this.request<CourseResponse>('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  }

  async updateCourse(id: string, course: Partial<Course>): Promise<CourseResponse> {
    return this.request<CourseResponse>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(course),
    });
  }

  async deleteCourse(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/courses/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService(); 