import type {Room} from "../types";
import api, {type ApiResponse} from "./api";

export const RoomService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Room[]>>("/rooms");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Room>>(`/rooms/${id}`);
    return response.data;
  },
  create: (data: Partial<Room>) => api.post("/rooms", data),
  update: (id: string, data: Room) => api.put(`/rooms/${id}`, data),
  delete: (id: string) => api.delete(`/rooms/${id}`),
};
