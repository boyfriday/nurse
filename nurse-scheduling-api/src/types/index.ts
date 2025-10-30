export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'nurse' | 'head_nurse';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Shift {
    id: number;
    date_start_time: Date;
    date_end_time: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ShiftAssignment {
    id: number;
    user_id: number;
    shift_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface LeaveRequest {
    id: number;
    shift_assignment_id: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_by?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AuthPayload {
    id: number;
    role: string;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    message?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}