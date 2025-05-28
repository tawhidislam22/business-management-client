import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { toast } from 'react-hot-toast';

const JoinAsEmployee = () => {
  const { createUser, updateUserProfile, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Create user
      const result = await createUser(data.email, data.password);

      // Update profile
      await updateUserProfile(data.fullName, '');

      // Save user to database
      const userInfo = {
        name: data.fullName,
        email: data.email,
        role: 'employee',
        dateOfBirth: data.dateOfBirth
      };

      await axiosPublic.post('/users', userInfo);

      // Get JWT token
      const response = await axiosPublic.post('/jwt', { email: result.user.email });
      localStorage.setItem('access_token', response.data.token);

      toast.success('Successfully registered!');
      navigate('/dashboard');
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

      // Save user to database
      const userInfo = {
        name: result.user.displayName,
        email: result.user.email,
        role: 'employee',
        dateOfBirth: null
      };

      await axiosPublic.post('/users', userInfo);

      // Get JWT token
      const response = await axiosPublic.post('/jwt', { email: result.user.email });
      localStorage.setItem('access_token', response.data.token);

      toast.success('Successfully registered with Google!');
      navigate('/dashboard');
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
          <h2 className="text-3xl font-bold text-center mb-6">Join as Employee</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className={`input input-bordered ${errors.fullName ? 'input-error' : ''}`}
                {...register('fullName', {
                  required: 'Full name is required'
                })}
              />
              {errors.fullName && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.fullName.message}</span>
                </label>
              )}
            </div>

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
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                    message: 'Password must contain at least one uppercase, one lowercase, one number and one special character'
                  }
                })}
              />
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <input
                type="date"
                className={`input input-bordered ${errors.dateOfBirth ? 'input-error' : ''}`}
                {...register('dateOfBirth', {
                  required: 'Date of birth is required'
                })}
              />
              {errors.dateOfBirth && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.dateOfBirth.message}</span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              Register
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
            Already have an account?{' '}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinAsEmployee; 