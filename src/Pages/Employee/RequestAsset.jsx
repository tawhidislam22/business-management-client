import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';

const RequestAsset = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('available');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const { data: assets = [], refetch, isLoading, error } = useQuery({
    queryKey: ['available-assets', searchTerm, typeFilter, availabilityFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        type: typeFilter,
        availability: availabilityFilter
      });
      const res = await axiosSecure.get(`/assets?${params.toString()}`);
      return Array.isArray(res.data) ? res.data : [];
    }
  });

  const handleRequest = async (data) => {
    if (!selectedAsset) return;

    try {
      const requestData = {
        assetId: selectedAsset._id,
        assetName: selectedAsset.name,
        assetType: selectedAsset.type,
        requesterEmail: user.email,
        requesterName: user.displayName,
        requestDate: new Date(),
        notes: data.notes,
        status: 'pending'
      };

      await axiosSecure.post('/requests', requestData);
      toast.success('Asset requested successfully');
      reset();
      refetch();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request asset');
    }
  };

  const openModal = (asset) => {
    setSelectedAsset(asset);
    const modal = document.getElementById('request-modal');
    modal.showModal();
  };

  const closeModal = () => {
    setSelectedAsset(null);
    reset();
    const modal = document.getElementById('request-modal');
    modal.close();
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-error">Error loading assets. Please try again later.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Request Asset</h2>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search by asset name"
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-control">
          <select
            className="select select-bordered w-full"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="returnable">Returnable</option>
            <option value="non-returnable">Non-returnable</option>
          </select>
        </div>

        <div className="form-control">
          <select
            className="select select-bordered w-full"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="available">Available</option>
            <option value="unavailable">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div key={asset._id} className="card bg-base-100 shadow-xl">
            <figure className="px-4 pt-4">
              <img
                src={asset.image || '/default-asset.png'}
                alt={asset.name}
                className="rounded-xl h-48 w-full object-cover"
                onError={(e) => {
                  e.target.src = '/default-asset.png';
                }}
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">{asset.name}</h3>
              <p className="text-sm text-gray-600">{asset.type}</p>
              <p className="text-sm">{asset.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className={`badge ${
                  asset.quantity > 0 ? 'badge-success' : 'badge-error'
                }`}>
                  {asset.quantity} available
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => openModal(asset)}
                  disabled={asset.quantity === 0}
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Modal */}
      <dialog id="request-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">
            Request {selectedAsset?.name}
          </h3>
          <form onSubmit={handleSubmit(handleRequest)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Additional Notes</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Why do you need this asset?"
                {...register('notes', {
                  required: 'Please provide a reason for your request'
                })}
              ></textarea>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Submit Request
              </button>
              <button
                type="button"
                className="btn"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>

      {assets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">No assets found</p>
        </div>
      )}
    </div>
  );
};

export default RequestAsset;