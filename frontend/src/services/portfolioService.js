import { api } from './api';

export const getPublishedProjects = () => api.get('/projects').then((res) => res.data.projects);
export const getCertifications = () => api.get('/certifications').then((res) => res.data.certifications);
export const sendContactMessage = (payload) => api.post('/contact', payload).then((res) => res.data);
