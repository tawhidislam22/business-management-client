import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import useAdmin from '../../hooks/useAdmin';
import { useQuery } from '@tanstack/react-query';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { isHR } = useAdmin();
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const { data: userDetails = {}, refetch } = useQuery({
    queryKey: ['user-details', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const onSubmit = async (data) => {
    try {
      // Update Firebase profile
      await updateUserProfile(data.name, data.photoURL);

      // Update database profile
      await axiosSecure.patch(`/users/${user.email}`, {
        name: data.name,
        photoURL: data.photoURL,
        dateOfBirth: data.dateOfBirth
      });

      toast.success('Profile updated successfully');
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleEdit = () => {
    reset({
      name: user?.displayName,
      email: user?.email,
      photoURL: user?.photoURL,
      dateOfBirth: userDetails.dateOfBirth
    });
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">My Profile</h2>

        <div className="bg-base-100 shadow-xl rounded-box p-6">
          {!isEditing ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="avatar">
                  <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={user?.photoURL || '/default-avatar.png'}
                      alt={user?.displayName}
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{user?.displayName}</h3>
                  <p className="text-base-content/60">{user?.email}</p>
                  <div className="badge badge-primary mt-2">{isHR ? 'HR Manager' : 'Employee'}</div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="divider"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Personal Information</h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Date of Birth:</span>{' '}
                      {userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth).toLocaleDateString() : 'Not specified'}
                    </p>
                    <p>
                      <span className="font-medium">Join Date:</span>{' '}
                      {userDetails.joinDate ? new Date(userDetails.joinDate).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                </div>

                {isHR && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Company Information</h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Company:</span>{' '}
                        {userDetails.company?.name || 'Not specified'}
                      </p>
                      <p>
                        <span className="font-medium">Package:</span>{' '}
                        {userDetails.package?.name || 'Not specified'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleEdit}
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters'
                    }
                  })}
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={user?.email}
                  disabled
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Profile Picture URL</span>
                </label>
                <input
                  type="url"
                  className={`input input-bordered w-full ${errors.photoURL ? 'input-error' : ''}`}
                  {...register('photoURL', {
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Please enter a valid URL'
                    }
                  })}
                />
                {errors.photoURL && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.photoURL.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date of Birth</span>
                </label>
                <input
                  type="date"
                  className={`input input-bordered w-full ${errors.dateOfBirth ? 'input-error' : ''}`}
                  {...register('dateOfBirth')}
                />
                {errors.dateOfBirth && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.dateOfBirth.message}</span>
                  </label>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
