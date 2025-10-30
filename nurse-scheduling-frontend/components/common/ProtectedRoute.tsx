'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Header from './Header';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRole?: 'head_nurse' | 'nurse';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    const { isAuthenticated, isHeadNurse, isNurse } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (allowedRole === 'head_nurse' && !isHeadNurse) {
            router.push('/nurse/schedule');
            return;
        }

        if (allowedRole === 'nurse' && !isNurse) {
            router.push('/head-nurse/dashboard');
            return;
        }
    }, [isAuthenticated, isHeadNurse, isNurse, router, allowedRole]);

    if (!isAuthenticated) {
        return null;
    }

    if (allowedRole === 'head_nurse' && !isHeadNurse) {
        return null;
    }

    if (allowedRole === 'nurse' && !isNurse) {
        return null;
    }

    return (
        <>
            <Header />
            {children}
        </>
    );
};

export default ProtectedRoute;