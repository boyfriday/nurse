'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
    const { user, logout, isAuthenticated, isHeadNurse, isNurse } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-xl font-bold">
                        Nurse Scheduling
                    </Link>

                    <nav className="hidden md:flex space-x-6">
                        {isHeadNurse && (
                            <>
                                <Link href="/head-nurse/dashboard" className="hover:text-blue-200 transition-colors">
                                    Dashboard
                                </Link>
                                <Link href="/head-nurse/shifts" className="hover:text-blue-200 transition-colors">
                                    Shifts
                                </Link>
                                <Link href="/head-nurse/leave-requests" className="hover:text-blue-200 transition-colors">
                                    Leave Requests
                                </Link>
                            </>
                        )}
                        {isNurse && (
                            <Link href="/nurse/schedule" className="hover:text-blue-200 transition-colors">
                                My Schedule
                            </Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="text-sm">
                        Welcome, <strong>{user?.name}</strong> ({user?.role})
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;