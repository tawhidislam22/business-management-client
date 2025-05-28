import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full btn btn-primary"
                    >
                        Login
                    </button>
                </form>

                <div className="divider">OR</div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full btn btn-outline gap-2"
                >
                    <FaGoogle /> Continue with Google
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;