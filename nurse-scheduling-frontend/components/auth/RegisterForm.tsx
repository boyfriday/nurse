'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    role: string;
}

const RegisterForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
    const { register: registerUser } = useAuth();
    const router = useRouter();

    const onSubmit = async (data: RegisterFormData) => {
        const result = await registerUser(data);
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
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                        id="name"
                        type="text"
                        placeholder="Name"
                        {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
                </div>
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
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                        id="password"
                        type="password"
                        placeholder="Password"
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                    />
                    {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Role
                    </label>
                    <select
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.role ? 'border-red-500' : ''}`}
                        id="role"
                        {...register('role', { required: 'Role is required' })}
                    >
                        <option value="">Select Role</option>
                        <option value="nurse">Nurse</option>
                        <option value="head_nurse">Head Nurse</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-xs italic mt-1">{errors.role.message}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Register
                    </button>
                    <a
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        href="/login"
                    >
                        Already have an account?
                    </a>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;