import { api } from "./client";

export const listCars = () => api.get("/accounts/cars/");
export const createCar = (car) => api.post("/accounts/cars/", car);
export const deleteCar = (id) => api.del(`/accounts/cars/${id}/`);
