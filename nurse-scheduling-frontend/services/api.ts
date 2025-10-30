import axios from 'axios';
import { User, Shift, ScheduleItem, LeaveRequest, AuthResponse, ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth APIs
export const register = (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
}): Promise<AuthResponse> => api.post('/auth/register', userData).then(res => res.data);

export const login = (credentials: {
    email: string;
    password: string;
}): Promise<AuthResponse> => api.post('/auth/login', credentials).then(res => res.data);

// Shift APIs
export const createShift = (shiftData: {
    date_start_time: string;
    date_end_time: string;
}): Promise<ApiResponse<Shift>> => api.post('/shifts', shiftData).then(res => res.data);

export const assignShift = (assignmentData: {
    user_id: number;
    shift_id: number;
}): Promise<ApiResponse> => api.post('/shift-assignments', assignmentData).then(res => res.data);

export const getMySchedule = (params: {
    startDate?: string;
    endDate?: string;
}): Promise<ApiResponse<{ schedule: ScheduleItem[] }>> =>
    api.get('/my-schedule', { params }).then(res => res.data);

// Leave APIs
export const requestLeave = (leaveData: {
    shift_assignment_id: number;
    reason: string;
}): Promise<ApiResponse<LeaveRequest>> => api.post('/leave-requests', leaveData).then(res => res.data);

export const getAllLeaveRequests = (): Promise<ApiResponse<{ leaveRequests: any[] }>> =>
    api.get('/leave-requests').then(res => res.data);

export const updateLeaveRequestStatus = (id: number, status: string): Promise<ApiResponse<LeaveRequest>> =>
    api.patch(`/leave-requests/${id}/approve`, { status }).then(res => res.data);

export default api;