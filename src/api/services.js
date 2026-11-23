import { api } from "./client";

// Customer-facing: only active services.
export const listActiveServices = () => api.get("/services/active/");

// Admin: full catalog + CRUD.
export const listAllServices = () => api.get("/services/");
export const createService = (service) => api.post("/services/", service);
export const updateService = (id, service) => api.patch(`/services/${id}/`, service);
export const deleteService = (id) => api.del(`/services/${id}/`);
