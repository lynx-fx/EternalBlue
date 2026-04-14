const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const isFormData = options.body instanceof FormData;
  const headers: any = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    // Return data even if not ok, but add status info
    return {
      data,
      $ok: response.ok,
      $status: response.status
    };
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      return {
        data: null,
        success: false,
        message: 'Unable to connect to the server. Please check your connection.',
        $ok: false,
        $status: 0
      };
    }
    return {
      data: null,
      success: false,
      message: error.message || 'An unexpected error occurred.',
      $ok: false,
      $status: 500
    };
  }
};
