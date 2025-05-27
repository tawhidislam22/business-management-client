import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../../Coponents/SocialLogin/SocialLogin";
import useAuth from "../../Hooks/useAuth";
import loginLottie from "../../assets/Lottie-File/Login-lottie.json";
import Lottie from "lottie-react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import toast from "react-hot-toast";

const LogIn = () => {
    const { signIn } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Sign in user
            const result = await signIn(data.email, data.password);
            
            // Get JWT token
            const response = await axiosPublic.post('/jwt', {
                email: result.user.email
            });
            
            if (response.data.token) {
                // Save token in localStorage
                localStorage.setItem('access-token', response.data.token);
                
                toast.success('Login successful!');
                reset();
                navigate(from, { replace: true });
            }
        } catch (error) {
            toast.error(error.message || 'Failed to login');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <div className="hero-content flex-col lg:flex-row-reverse gap-8">
                <div className="text-center lg:text-left max-w-md">
                    <Lottie animationData={loginLottie} className="w-full" />
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="text-4xl font-bold text-center mb-4">Login</h1>
                        
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className="input input-bordered"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="password"
                                    className="input input-bordered w-full"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : "Login"}
                            </button>
                        </div>

                        <p className="text-center mt-4">
                            Don't have an account?{" "}
                            <Link to="/joinAsEmployee" className="text-primary hover:underline">
                                Join as Employee
                            </Link>
                            {" or "}
                            <Link to="/joinAsHr" className="text-primary hover:underline">
                                Join as HR
                            </Link>
                        </p>

                        <div className="divider">OR</div>

                        <SocialLogin />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LogIn;