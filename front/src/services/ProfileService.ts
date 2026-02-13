import api from "./api.ts";
import type {Activity, ApiResponse, Profile} from "../types";
import type {ActivityDto, ProfileDto} from "../types/dto.ts";

export const ProfileService = {
    async getAllProfiles() {
        const res = await api.get<ApiResponse<Profile[]>>("/profiles");
        return res.data.data;
    },

    async createProfile(profile: ProfileDto) {
        const res = await api.post<ApiResponse<Profile>>("/profiles", profile);
        return res.data.data;
    },

    async getAllActivities(profileId: number) {
        const res = await api.get<ApiResponse<Activity[]>>("/profiles/" + profileId + "/activities");
        return res.data.data;
    },

    async createActivity(profileId: number, activity: ActivityDto) {
        const res = await api.post<ApiResponse<Activity>>("/profiles/" + profileId + "/activities", activity);
        return res.data.data;
    },

    async getProfileById(profileId: number) {
        const res = await api.get<ApiResponse<Profile>>("/profiles/" + profileId);
        return res.data.data;
    }
}