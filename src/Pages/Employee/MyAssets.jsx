import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AssetPDF from '../../components/AssetPDF';

const MyAssets = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: assets = [], refetch, isLoading } = useQuery({
    queryKey: ['my-assets', user?.email, searchTerm, statusFilter, typeFilter],
    queryFn: async () => {
      if (!user?.email) return [];
      const params = new URLSearchParams({
        email: user.email,
        search: searchTerm,
        status: statusFilter,
        type: typeFilter
      });
      const res = await axiosSecure.get(`/requests?${params.toString()}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  const handleReturn = async (assetId) => {
    try {
      await axiosSecure.patch(`/requests/${assetId}`, {
        status: 'returned',
        returnDate: new Date()
      });
      toast.success('Asset returned successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return asset');
    }
  };

  const handleCancel = async (assetId) => {
    try {
      await axiosSecure.patch(`/requests/${assetId}`, { status: 'cancelled' });
      toast.success('Request cancelled successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel request');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">My Assets</h2>

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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
      </div>

      {/* Assets Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Asset Type</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset._id}>
                <td>{asset.name}</td>
                <td>{asset.type}</td>
                <td>{new Date(asset.requestDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${
                    asset.status === 'approved' ? 'badge-success' :
                    asset.status === 'rejected' ? 'badge-error' :
                    asset.status === 'returned' ? 'badge-info' :
                    asset.status === 'cancelled' ? 'badge-neutral' :
                    'badge-warning'
                  }`}>
                    {asset.status}
                  </span>
                </td>
                <td>
                  {asset.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(asset._id)}
                      className="btn btn-error btn-sm"
                    >
                      Cancel
                    </button>
                  )}
                  {asset.status === 'approved' && (
                    <div className="flex gap-2">
                      <PDFDownloadLink
                        document={<AssetPDF asset={asset} />}
                        fileName={`asset-${asset._id}.pdf`}
                        className="btn btn-primary btn-sm"
                      >
                        {({ loading }) => loading ? 'Loading...' : 'Print'}
                      </PDFDownloadLink>
                      {asset.type === 'returnable' && !asset.returned && (
                        <button
                          onClick={() => handleReturn(asset._id)}
                          className="btn btn-warning btn-sm"
                        >
                          Return
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {assets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">No assets found</p>
        </div>
      )}
    </div>
  );
};

export default MyAssets; 