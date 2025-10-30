import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthPayload } from '../types';

export interface AuthRequest extends Request {
    user?: User;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // 1. ดึง Token จาก Header 'Authorization: Bearer <token>'
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // 2. ตรวจสอบความถูกต้องของ Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as AuthPayload;

        // 3. ค้นหาผู้ใช้จากข้อมูลใน Token
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        // 4. แนบข้อมูลผู้ใช้ไปกับ request เพื่อให้ controller ใช้งานได้
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};