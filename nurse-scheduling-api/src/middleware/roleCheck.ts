import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const roleCheck = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};