const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || 'Something went wrong. Please try again.');
  }

  return body.data;
};

export const api = {
  getFarms: () => request('/farms'),
  createFarm: (farm) =>
    request('/farms', { method: 'POST', body: JSON.stringify(farm) }),
  createCrop: (crop) =>
    request('/crops', { method: 'POST', body: JSON.stringify(crop) }),
  getTodayTasks: () => request('/tasks/today'),
  completeTask: (taskId) =>
    request(`/tasks/${taskId}/complete`, { method: 'PATCH' }),
};

export { API_BASE_URL };
