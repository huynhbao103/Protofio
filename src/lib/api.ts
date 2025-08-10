// API utility functions for frontend
import { Project } from '@/types/project'

const API_BASE = '/api'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

// Helper function for API calls with retry logic
async function apiCall<T = any>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
  const attempt = async (): Promise<T> => {
    try {
      // Don't set Content-Type for FormData, let browser set it automatically
      const headers: HeadersInit = {}
      
      // Only set Content-Type to JSON if body is not FormData
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          ...headers,
          ...options.headers,
        },
        credentials: 'include', // Include cookies
        ...options,
      })

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`)
      }

      const data: ApiResponse<T> = await response.json()

      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable. Please try again later.')
        }
        if (response.status === 401) {
          throw new Error('Authentication required. Please login first.')
        }
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission for this action.')
        }
        if (response.status === 404) {
          throw new Error('Resource not found.')
        }
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.')
        }
        
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      if (!data.success) {
        throw new Error(data.error || 'API request failed')
      }

      return data.data as T
    } catch (error: any) {
      // Don't retry on client errors (4xx)
      if (error.message.includes('HTTP 4')) {
        throw error
      }
      
      throw error
    }
  }

  // Retry logic
  for (let i = 0; i < retries; i++) {
    try {
      return await attempt()
    } catch (error: any) {
      if (i === retries - 1) {
        throw error
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
      console.log(`Retrying API call (${i + 1}/${retries})...`)
    }
  }

  throw new Error('API call failed after all retries')
}

// Project API
export const projectApi = {
  // Get all projects (public)
  getAll: async () => {
    return apiCall<Project[]>('/projects')
  },

  // Get project by ID
  getById: async (id: string) => {
    return apiCall<Project>(`/projects/${id}`)
  },

  // Create new project (admin only)
  create: async (data: {
    name: string
    description: string
    technologies: string | string[]
    githubUrl?: string
    liveUrl?: string
    priority?: number
  }) => {
    // Ensure technologies is always an array
    const processedData = {
      ...data,
      technologies: Array.isArray(data.technologies) 
        ? data.technologies 
        : data.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
    }
    
    console.log('🚀 API create sending data:', processedData)
    
    return apiCall<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(processedData),
    })
  },

  // Update project (admin only)
  update: async (id: string, data: {
    name?: string
    description?: string
    technologies?: string[]
    githubUrl?: string
    liveUrl?: string
    priority?: number
    status?: string
  }) => {
    return apiCall<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete project (admin only)
  delete: async (id: string) => {
    return apiCall(`/projects/${id}`, {
      method: 'DELETE',
    })
  },

  // Upload files for project (admin only)
  uploadFiles: async (projectId: string, files: File[], isMain = false) => {
    const formData = new FormData()
    
    files.forEach(file => {
      formData.append('files', file)
    })
    
    if (isMain) {
      formData.append('isMain', 'true')
    }

    return apiCall(`/projects/${projectId}/upload`, {
      method: 'POST',
      body: formData,
    })
  },

  // Delete media from project (admin only)
  deleteMedia: async (projectId: string, mediaId: string) => {
    return apiCall(`/projects/${projectId}/media/${mediaId}`, {
      method: 'DELETE',
    })
  },

  // Set media as main image (admin only)
  setMainImage: async (projectId: string, mediaId: string) => {
    return apiCall(`/projects/${projectId}/media/${mediaId}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'setMain' }),
    })
  },
}

// Auth API
export const authApi = {
  // Login
  login: async (username: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },

  // Logout
  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    })
  },

  // Get current user
  me: async () => {
    return apiCall('/auth/me')
  },

  // Setup admin (first time only)
  setup: async () => {
    return apiCall('/auth/setup', {
      method: 'POST',
    })
  },
}

// Contact API
export const contactApi = {
  // Submit contact form
  submit: async (data: {
    name: string
    email: string
    subject: string
    message: string
  }) => {
    return apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Get contact messages (admin only)
  getAll: async () => {
    return apiCall('/contact')
  },

  // Delete contact message (admin only)
  delete: async (id: string) => {
    return apiCall(`/contact/${id}`, {
      method: 'DELETE',
    })
  },

  // Update contact message status (admin only)
  updateStatus: async (id: string, status: string) => {
    return apiCall(`/contact/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
}


