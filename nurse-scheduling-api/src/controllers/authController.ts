import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { AuthResponse } from '../types';

// Register a new user
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        // Generate JWT
        const payload = {
            id: user.id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || '', {
            expiresIn: process.env.JWT_EXPIRE
        });

        const response: AuthResponse = {
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };

        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. ค้นหาผู้ใช้จากอีเมล
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. เปรียบเทียบรหัสผ่านที่ส่งมากับรหัสผ่านที่เข้ารหัสไว้ในฐานข้อมูล
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. สร้าง JWT Payload
        const payload = {
            id: user.id,
            role: user.role
        };

        // 4. ลงนามสร้าง Token
        const token = jwt.sign(payload, process.env.JWT_SECRET || '', {
            expiresIn: process.env.JWT_EXPIRE
        });

        // 5. ส่งข้อมูลกลับไปให้ Flutter App
        const response: AuthResponse = {
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};