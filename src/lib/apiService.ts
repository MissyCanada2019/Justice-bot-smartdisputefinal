// API Service for connecting Next.js frontend to Flask backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private async makeRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const defaultOptions: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Include cookies for session management
      };

      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(username: string, email: string, password: string) {
    return this.makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async logout() {
    return this.makeRequest('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Case management endpoints
  async getCases() {
    return this.makeRequest('/api/cases');
  }

  async createCase(title: string, case_type: string) {
    return this.makeRequest('/api/cases', {
      method: 'POST',
      body: JSON.stringify({ title, case_type }),
    });
  }

  async getCaseDocuments(caseId: number) {
    return this.makeRequest(`/api/cases/${caseId}/documents`);
  }

  async uploadDocument(caseId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.makeRequest(`/api/cases/${caseId}/documents`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async analyzeCase(caseId: number) {
    return this.makeRequest(`/api/cases/${caseId}/analyze`, {
      method: 'POST',
    });
  }

  // Chat endpoints
  async sendChatMessage(message: string, caseId?: number) {
    return this.makeRequest('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, case_id: caseId }),
    });
  }

  // Form generation endpoints
  async generateForm(caseId: number, formType: string, formData: any = {}) {
    return this.makeRequest('/api/generate-form', {
      method: 'POST',
      body: JSON.stringify({
        case_id: caseId,
        form_type: formType,
        form_data: formData,
      }),
    });
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type { ApiResponse };

// Utility functions for common patterns
export const withApiErrorHandling = <T extends any[]>(
  apiCall: (...args: T) => Promise<ApiResponse>
) => {
  return async (...args: T): Promise<ApiResponse> => {
    try {
      const result = await apiCall(...args);
      if (!result.success) {
        console.error('API Error:', result.error);
      }
      return result;
    } catch (error) {
      console.error('Unexpected API Error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };
};

// Hook for checking backend connectivity
export const useBackendStatus = () => {
  const checkStatus = async () => {
    const result = await apiService.healthCheck();
    return result.success;
  };

  return { checkStatus };
};