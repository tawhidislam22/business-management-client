import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { toast } from 'react-hot-toast';

const packages = [
  {
    id: 1,
    name: 'Basic',
    members: 5,
    price: 5
  },
  {
    id: 2,
    name: 'Standard',
    members: 10,
    price: 8
  },
  {
    id: 3,
    name: 'Premium',
    members: 20,
    price: 15
  }
];

const JoinAsHR = () => {
  const { createUser, updateUserProfile, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(packages[0]);

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
        role: 'hr',
        dateOfBirth: data.dateOfBirth,
        company: {
          name: data.companyName,
          logo: data.companyLogo,
          package: selectedPackage
        }
      };

      await axiosPublic.post('/users', userInfo);

      // Get JWT token
      const response = await axiosPublic.post('/jwt', { email: result.user.email });
      localStorage.setItem('access_token', response.data.token);

      toast.success('Successfully registered!');
      navigate('/payment', { state: { package: selectedPackage } });
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
        role: 'hr',
        dateOfBirth: null,
        company: {
          name: '',
          logo: '',
          package: selectedPackage
        }
      };

      await axiosPublic.post('/users', userInfo);

      // Get JWT token
      const response = await axiosPublic.post('/jwt', { email: result.user.email });
      localStorage.setItem('access_token', response.data.token);

      toast.success('Successfully registered with Google!');
      navigate('/payment', { state: { package: selectedPackage } });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6">Join as HR Manager</h2>

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
                <span className="label-text">Company Name</span>
              </label>
              <input
                type="text"
                placeholder="XYZ Corporation"
                className={`input input-bordered ${errors.companyName ? 'input-error' : ''}`}
                {...register('companyName', {
                  required: 'Company name is required'
                })}
              />
              {errors.companyName && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.companyName.message}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Company Logo URL</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                className={`input input-bordered ${errors.companyLogo ? 'input-error' : ''}`}
                {...register('companyLogo', {
                  required: 'Company logo URL is required'
                })}
              />
              {errors.companyLogo && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.companyLogo.message}</span>
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Select Package</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`card bg-base-200 cursor-pointer transition-colors ${
                      selectedPackage.id === pkg.id ? 'border-2 border-primary' : ''
                    }`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <div className="card-body p-4 text-center">
                      <h3 className="font-bold">{pkg.name}</h3>
                      <p className="text-sm">{pkg.members} members</p>
                      <p className="text-lg font-semibold">${pkg.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              Register & Continue to Payment
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

export default JoinAsHR; 