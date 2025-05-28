import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { toast } from 'react-hot-toast';

const SocialLogin = ({ role = 'employee', redirectTo = '/dashboard', additionalData = {} }) => {
    const { googleSignIn } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();

            // Save user to database
            const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
                role: role,
                dateOfBirth: null,
                ...additionalData
            };

            await axiosPublic.post('/users', userInfo);

            // Get JWT token
            const response = await axiosPublic.post('/jwt', { email: result.user.email });
            localStorage.setItem('access_token', response.data.token);

            toast.success('Successfully signed in with Google!');
            navigate(redirectTo);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full"
            type="button"
        >
            <FaGoogle className="mr-2" /> Continue with Google
        </button>
    );
};

export default SocialLogin; 