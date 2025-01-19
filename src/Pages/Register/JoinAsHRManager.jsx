import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";


const JoinAsHRManager = () => {
    const {createUser}=useAuth()
    const axiosPublic=useAxiosPublic()
    const navigate=useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    
      const onSubmit = (data) => {
        console.log(data);
        createUser(data.email,data.password)
            .then(res=>{
                console.log(res)
                const userInfo = {
                    name: data.name,
                    email: data.email,
                    admin:true,
                    role:'hr'
                };
                return axiosPublic.post('/users', userInfo);
                navigate('/')
            })
            .catch(err=>{
                console.log(err.message)
            })
      };
    return (
        <div>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                    <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                        Join as HR Manager
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-gray-700 font-medium">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                {...register("fullName", { required: "Full Name is required" })}
                                className={`w-full mt-2 p-3 border rounded-lg focus:outline-none ${errors.fullName ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* Company Name */}
                        <div>
                            <label htmlFor="companyName" className="block text-gray-700 font-medium">
                                Company Name
                            </label>
                            <input
                                id="companyName"
                                type="text"
                                {...register("companyName", { required: "Company Name is required" })}
                                className={`w-full mt-2 p-3 border rounded-lg focus:outline-none ${errors.companyName ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.companyName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.companyName.message}
                                </p>
                            )}
                        </div>

                        {/* Company Logo */}
                        <div>
                            <label htmlFor="companyLogo" className="block text-gray-700 font-medium">
                                Company Logo
                            </label>
                            <input
                                id="companyLogo"
                                type="file"
                                {...register("companyLogo", {
                                    required: "Company Logo is required",
                                })}
                                className="w-full mt-2 p-3 border rounded-lg focus:outline-none"
                            />
                            {errors.companyLogo && (
                                <p className="text-red-500 text-sm mt-1">{errors.companyLogo.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email address",
                                    },
                                })}
                                className={`w-full mt-2 p-3 border rounded-lg focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-gray-700 font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                className={`w-full mt-2 p-3 border rounded-lg focus:outline-none ${errors.password ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label htmlFor="dob" className="block text-gray-700 font-medium">
                                Date of Birth
                            </label>
                            <input
                                id="dob"
                                type="date"
                                {...register("dob", { required: "Date of Birth is required" })}
                                className={`w-full mt-2 p-3 border rounded-lg focus:outline-none ${errors.dob ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.dob && (
                                <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
                            )}
                        </div>

                        {/* Package Selector */}
                        <div>
                            <label htmlFor="package" className="block text-gray-700 font-medium">
                                Select a Package
                            </label>
                            <select
                                id="package"
                                {...register("package", { required: "Please select a package" })}
                                className={`w-full mt-2 p-3 border rounded-lg focus:outline-none ${errors.package ? "border-red-500" : "border-gray-300"
                                    }`}
                            >
                                <option value="">Choose a Package</option>
                                <option value="5_members">$5 - Maximum 5 Employees</option>
                                <option value="10_members">$8 - Maximum 10 Employees</option>
                                <option value="20_members">$15 - Maximum 20 Employees</option>
                            </select>
                            {errors.package && (
                                <p className="text-red-500 text-sm mt-1">{errors.package.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinAsHRManager;