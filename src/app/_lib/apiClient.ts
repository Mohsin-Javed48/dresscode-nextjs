const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// Get stored token from localStorage
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// Create authenticated fetch function
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include",
  };

  return fetch(`${API_BASE}${endpoint}`, config);
}

// API functions
export const api = {
  // User authentication
  login: async (credentials: { email: string; password: string }) => {
    const response = await authenticatedFetch("/api/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const response = await authenticatedFetch("/api/user/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  logout: async () => {
    const response = await authenticatedFetch("/api/user/logout", {
      method: "POST",
    });
    return response.json();
  },

  verifySession: async () => {
    const response = await authenticatedFetch("/api/user/verify-session", {
      method: "GET",
    });
    return response.json();
  },

  // User management
  getUserByEmail: async (email: string) => {
    const response = await authenticatedFetch(`/api/user/email/${email}`, {
      method: "GET",
    });
    return response.json();
  },

  updateProfile: async (userId: string, userData: any) => {
    const response = await authenticatedFetch(`/api/user/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Google OAuth
  googleCallback: async (idToken: string) => {
    const response = await authenticatedFetch("/api/user/google/callback", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
    return response.json();
  },
};

// Helper function to handle API responses
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
}
