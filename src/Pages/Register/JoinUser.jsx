import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import SocialLogin from "../../Components/SocialLogin";
import useAuth from "../../hooks/useAuth";

const JoinUser = () => {
    const { createUser, updateUserProfile } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('employee');
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm();

    const password = watch("password");

    const uploadImage = async (file) => {
        const imageFile = new FormData();
        imageFile.append('image', file);
        const response = await axiosPublic.post(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`,
            imageFile
        );
        return response.data.data.url;
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Upload profile image if provided
            let photoURL = null;
            if (data.photo && data.photo[0]) {
                photoURL = await uploadImage(data.photo[0]);
            }

            // Upload company logo if HR and logo provided
            let companyLogo = null;
            if (userRole === 'hr' && data.companyLogo && data.companyLogo[0]) {
                companyLogo = await uploadImage(data.companyLogo[0]);
            }

            // Create user
            const result = await createUser(data.email, data.password);
            
            // Update profile
            await updateUserProfile(data.name, photoURL);

            // Prepare user info based on role
            const userInfo = {
                name: data.name,
                email: data.email,
                role: userRole,
                photo: photoURL,
                dateOfJoining: new Date(),
                ...(userRole === 'employee' ? {
                    department: data.department
                } : {
                    companyName: data.companyName,
                    companyLogo: companyLogo
                })
            };

            // Save user info to database
            const dbResponse = await axiosPublic.post('/users', userInfo);

            if (dbResponse.data.insertedId) {
                // Get JWT token
                const response = await axiosPublic.post('/jwt', {
                    email: result.user.email
                });
                
                if (response.data.token) {
                    localStorage.setItem('access-token', response.data.token);
                    toast.success('Registration successful!');
                    reset();
                    navigate('/');
                }
            }
        } catch (error) {
            toast.error(error.message || 'Failed to register');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-8">
            <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
                <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-4xl font-bold text-center mb-4">Create Account</h1>

                    {/* Role Selection */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Join as</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                        >
                            <option value="employee">Employee</option>
                            <option value="hr">HR Manager</option>
                        </select>
                    </div>

                    {/* Full Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Full Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="input input-bordered"
                            {...register("name", {
                                required: "Name is required",
                                minLength: {
                                    value: 3,
                                    message: "Name must be at least 3 characters"
                                }
                            })}
                        />
                        {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
                    </div>

                    {/* Email */}
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

                    {/* Conditional Fields based on Role */}
                    {userRole === 'employee' ? (
                        // Employee-specific fields
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Department</span>
                            </label>
                            <select
                                className="select select-bordered w-full"
                                {...register("department", {
                                    required: "Department is required"
                                })}
                            >
                                <option value="">Select Department</option>
                                <option value="engineering">Engineering</option>
                                <option value="marketing">Marketing</option>
                                <option value="sales">Sales</option>
                                <option value="finance">Finance</option>
                                <option value="hr">Human Resources</option>
                            </select>
                            {errors.department && <span className="text-red-500 text-sm mt-1">{errors.department.message}</span>}
                        </div>
                    ) : (
                        // HR-specific fields
                        <>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Company Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Company Name"
                                    className="input input-bordered"
                                    {...register("companyName", {
                                        required: "Company name is required"
                                    })}
                                />
                                {errors.companyName && <span className="text-red-500 text-sm mt-1">{errors.companyName.message}</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Company Logo</span>
                                </label>
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full"
                                    accept="image/*"
                                    {...register("companyLogo", {
                                        required: "Company logo is required"
                                    })}
                                />
                                {errors.companyLogo && <span className="text-red-500 text-sm mt-1">{errors.companyLogo.message}</span>}
                            </div>
                        </>
                    )}

                    {/* Password */}
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
                                    },
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                                        message: 'Password must contain at least one uppercase, one lowercase, one number and one special character'
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

                    {/* Confirm Password */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Confirm Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            className="input input-bordered"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: value => value === password || "Passwords do not match"
                            })}
                        />
                        {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>}
                    </div>

                    {/* Profile Photo */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Profile Photo</span>
                        </label>
                        <input
                            type="file"
                            className="file-input file-input-bordered w-full"
                            accept="image/*"
                            {...register("photo")}
                        />
                    </div>

                    <div className="form-control mt-6">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                `Register as ${userRole === 'hr' ? 'HR Manager' : 'Employee'}`
                            )}
                        </button>
                    </div>

                    <p className="text-center mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline">
                            Login here
                        </Link>
                    </p>

                    <div className="divider">OR</div>

                    <SocialLogin 
                        role={userRole}
                        additionalData={userRole === 'hr' ? {
                            company: {
                                name: '',
                                logo: '',
                                package: 'free'
                            }
                        } : {}}
                    />
                </form>
            </div>
        </div>
    );
};

export default JoinUser; 