import { api } from './api';

export const authApi = {
  me: () => api.get('/auth/me').then((res) => res.data.admin),
  login: (email, password) => api.post('/auth/login', { email, password }).then((res) => res.data.admin),
  logout: () => api.post('/auth/logout'),
};

export const adminApi = {
  status: () => api.get('/admin/status').then((res) => res.data),

  listProjects: () => api.get('/admin/projects').then((res) => res.data.projects),
  getProject: (id) => api.get(`/admin/projects/${id}`).then((res) => res.data.project),
  createProject: (data) => api.post('/admin/projects', data).then((res) => res.data.project),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data).then((res) => res.data.project),
  setPublished: (id, published) =>
    api.patch(`/admin/projects/${id}/publish`, { published }).then((res) => res.data.project),
  reorderProjects: (ids) => api.put('/admin/projects/reorder', { ids }).then((res) => res.data.projects),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),

  uploadImage: (file, onProgress) => {
    const form = new FormData();
    form.append('image', file);
    return api
      .post('/admin/uploads', form, {
        onUploadProgress: (event) => event.total && onProgress?.(Math.round((event.loaded / event.total) * 100)),
      })
      .then((res) => res.data);
  },

  listCertifications: () => api.get('/admin/certifications').then((res) => res.data.certifications),
  createCertification: (data) => api.post('/admin/certifications', data).then((res) => res.data.certification),
  updateCertification: (id, data) =>
    api.put(`/admin/certifications/${id}`, data).then((res) => res.data.certification),
  deleteCertification: (id) => api.delete(`/admin/certifications/${id}`),

  listMessages: () => api.get('/admin/messages').then((res) => res.data.messages),
  setMessageRead: (id, read) => api.patch(`/admin/messages/${id}/read`, { read }).then((res) => res.data.message),
  deleteMessage: (id) => api.delete(`/admin/messages/${id}`),
};
