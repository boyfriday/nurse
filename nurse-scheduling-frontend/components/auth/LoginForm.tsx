'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

interface LoginFormData {
    email: string;
    password: string;
}

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const { login } = useAuth();
    const router = useRouter();

    const onSubmit = async (data: LoginFormData) => {
        const result = await login(data);
        if (result.success) {
            const { user } = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role === 'head_nurse') {
                router.push('/head-nurse/dashboard');
            } else {
                router.push('/nurse/schedule');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                        id="email"
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                        id="password"
                        type="password"
                        placeholder="Password"
                        {...register('password', { required: 'Password is required' })}
                    />
                    {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Sign In
                    </button>
                    <a
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        href="/register"
                    >
                        Don't have an account?
                    </a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;