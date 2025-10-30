export interface User {
    id: number;
    name: string;
    email: string;
    role: 'nurse' | 'head_nurse';
}

export interface Shift {
    id: number;
    date_start_time: string;
    date_end_time: string;
}

export interface ShiftAssignment {
    id: number;
    user_id: number;
    shift_id: number;
    Shift?: Shift;
}

export interface LeaveRequest {
    id: number;
    shift_assignment_id: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_by?: number;
}

export interface ScheduleItem {
    id: number;
    date_start_time: string;
    date_end_time: string;
    leaveRequest?: {
        id: number;
        reason: string;
        status: 'pending' | 'approved' | 'rejected';
    };
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}