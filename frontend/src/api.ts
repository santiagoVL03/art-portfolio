export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(
  /\/+$/,
  '',
);

const TOKEN_KEY = 'portfolio_token';

export interface Drawing {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  url: string;
}

export const imageUrl = (url: string) => (url.startsWith('http') ? url : `${API_URL}${url}`);

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('No pudimos conectar con la API. Revisá que esté levantada.');
  }

  if (response.status === 401) {
    clearToken();
  }

  if (!response.ok) {
    let message = 'Ocurrió un error inesperado.';
    try {
      const body = await response.json();
      message = Array.isArray(body.message) ? body.message.join(' ') : (body.message ?? message);
    } catch {
      // La respuesta no era JSON: nos quedamos con el mensaje genérico.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const fetchDrawings = () => request<Drawing[]>('/api/drawings');

export const login = async (username: string, password: string) => {
  const data = await request<{ token: string }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  setToken(data.token);
  return data;
};

export const uploadDrawing = (input: { title: string; description: string; file: File }) => {
  const form = new FormData();
  form.append('title', input.title);
  form.append('description', input.description);
  form.append('image', input.file);
  return request<Drawing>('/api/drawings', { method: 'POST', body: form });
};

export const deleteDrawing = (id: string) =>
  request<{ ok: true }>(`/api/drawings/${id}`, { method: 'DELETE' });
