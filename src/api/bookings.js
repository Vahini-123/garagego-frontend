import { api } from "./client";

export const createBooking = (booking) => api.post("/bookings/", booking);
export const myBookings = () => api.get("/bookings/mine/");
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status/`, { status });
export const updateEstimatedCompletion = (id, estimated_completion_date) =>
  api.patch(`/bookings/${id}/status/`, { estimated_completion_date });

export function adminAllBookings(filters = {}) {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return api.get(`/bookings/admin/all/${params ? `?${params}` : ""}`);
}
