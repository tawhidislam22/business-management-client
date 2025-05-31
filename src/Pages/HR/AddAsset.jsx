import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

const AddAsset = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${user?.email}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        toast.error('Failed to fetch user information');
      }
    };
    if (user?.email) {
      fetchUserInfo();
    }
  }, [user]);

  const onSubmit = async (data) => {
    if (!userInfo?.company.name) {
      toast.error('Company information not found');
      return;
    }

    try {
      setIsLoading(true);
      const assetData = {
        name: data.name,
        type: data.type,
        quantity: parseInt(data.quantity),
        image: data.image,
        description: data.description,
        companyName: userInfo.company.name,
        hrEmail: userInfo.email,
        status: 'available',
        createdAt: new Date().toISOString()
      };

      const response = await axios.post('http://localhost:5000/assets', assetData);
      
      if (response.data.insertedId) {
        toast.success('Asset added successfully');
        reset();
        navigate('/dashboard/asset-list');
      } else {
        toast.error('Failed to add asset');
      }
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error(error.response?.data?.message || 'Failed to add asset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Add New Asset</h2>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700 dark:text-gray-300">Product Name</span>
            </label>
            <input
              type="text"
              className="input"
              {...register('name', {
                required: 'Product name is required',
                minLength: {
                  value: 3,
                  message: 'Product name must be at least 3 characters'
                }
              })}
            />
            {errors.name && (
              <label className="label">
                <span className="text-red-500 text-sm">{errors.name.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700 dark:text-gray-300">Product Type</span>
            </label>
            <select
              className="input"
              {...register('type', {
                required: 'Product type is required'
              })}
            >
              <option value="">Select type</option>
              <option value="returnable">Returnable</option>
              <option value="non-returnable">Non-returnable</option>
            </select>
            {errors.type && (
              <label className="label">
                <span className="text-red-500 text-sm">{errors.type.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700 dark:text-gray-300">Quantity</span>
            </label>
            <input
              type="number"
              className="input"
              {...register('quantity', {
                required: 'Quantity is required',
                min: {
                  value: 1,
                  message: 'Quantity must be at least 1'
                }
              })}
            />
            {errors.quantity && (
              <label className="label">
                <span className="text-red-500 text-sm">{errors.quantity.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700 dark:text-gray-300">Product Image URL</span>
            </label>
            <input
              type="url"
              className="input"
              {...register('image', {
                required: 'Product image URL is required',
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: 'Please enter a valid URL'
                }
              })}
            />
            {errors.image && (
              <label className="label">
                <span className="text-red-500 text-sm">{errors.image.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-700 dark:text-gray-300">Description</span>
            </label>
            <textarea
              className="input min-h-[100px]"
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters'
                }
              })}
            />
            {errors.description && (
              <label className="label">
                <span className="text-red-500 text-sm">{errors.description.message}</span>
              </label>
            )}
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn-primary w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Adding Asset...' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAsset; 