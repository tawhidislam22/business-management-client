import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { signIn, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await signIn(data.email, data.password);
      const response = await axiosPublic.post('/jwt', { email: result.user.email });
      localStorage.setItem('access_token', response.data.token);
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleSignIn();
      const response = await axiosPublic.post('/jwt', { email: result.user.email });
      localStorage.setItem('access_token', response.data.token);
      toast.success('Successfully logged in with Google!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              Login
            </button>
          </form>

          <div className="divider">OR</div>

          <button
            onClick={handleGoogleSignIn}
            className={`btn btn-outline w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            <FaGoogle className="mr-2" /> Continue with Google
          </button>

          <p className="text-center mt-4">
            Don't have an account?{' '}
            <Link to="/join-as-employee" className="text-primary">
              Join as Employee
            </Link>
            {' or '}
            <Link to="/join-as-hr" className="text-primary">
              Join as HR
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 