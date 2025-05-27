import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            
            // Save user info to database
            const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
                role: 'employee', // Default role for social login
                dateOfJoining: new Date()
            };

            // Save to database
            await axiosPublic.post("/users", userInfo);

            // Get JWT token
            const response = await axiosPublic.post('/jwt', {
                email: result.user.email
            });
            
            if (response.data.token) {
                localStorage.setItem('access-token', response.data.token);
                toast.success('Login successful!');
                navigate(from, { replace: true });
            }
        } catch (error) {
            toast.error(error.message || 'Failed to login with Google');
            console.error('Google Sign-in Error:', error);
        }
    };

    return (
        <div className="flex justify-center">
            <button
                onClick={handleGoogleSignIn}
                className="btn btn-outline hover:bg-orange-500 hover:border-orange-500 gap-2"
            >
                <FaGoogle className="text-xl" />
                Continue with Google
            </button>
        </div>
    );
};

export default SocialLogin;