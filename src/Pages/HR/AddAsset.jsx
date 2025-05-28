import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddAsset = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const assetData = {
        ...data,
        quantity: parseInt(data.quantity),
        createdAt: new Date().toISOString()
      };

      const res = await axiosSecure.post('/assets', assetData);
      toast.success('Asset added successfully');
      reset();
      navigate('/dashboard/asset-list');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add asset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Add New Asset</h2>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Name</span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
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
                <span className="label-text-alt text-error">{errors.name.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Type</span>
            </label>
            <select
              className={`select select-bordered w-full ${errors.type ? 'select-error' : ''}`}
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
                <span className="label-text-alt text-error">{errors.type.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Quantity</span>
            </label>
            <input
              type="number"
              className={`input input-bordered w-full ${errors.quantity ? 'input-error' : ''}`}
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
                <span className="label-text-alt text-error">{errors.quantity.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Image URL</span>
            </label>
            <input
              type="url"
              className={`input input-bordered w-full ${errors.image ? 'input-error' : ''}`}
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
                <span className="label-text-alt text-error">{errors.image.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
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
                <span className="label-text-alt text-error">{errors.description.message}</span>
              </label>
            )}
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
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