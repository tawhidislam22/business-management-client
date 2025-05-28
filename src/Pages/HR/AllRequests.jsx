import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';

const AllRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: { requests = [], totalRequests = 0 } = {}, refetch, isLoading } = useQuery({
    queryKey: ['requests', searchTerm, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        page,
        limit: itemsPerPage
      });
      const res = await axiosSecure.get(`/requests?${params.toString()}`);
      return res.data;
    }
  });

  const handleApprove = async (requestId) => {
    try {
      await axiosSecure.patch(`/requests/${requestId}/approve`);
      toast.success('Request approved successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axiosSecure.patch(`/requests/${requestId}/reject`);
      toast.success('Request rejected successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const totalPages = Math.ceil(totalRequests / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">All Asset Requests</h2>

      {/* Search Section */}
      <div className="form-control max-w-md mb-8">
        <input
          type="text"
          placeholder="Search by requester name or email"
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Asset Type</th>
              <th>Requester</th>
              <th>Request Date</th>
              <th>Additional Note</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>
                  <div className="flex items-center gap-2">
                    <img
                      src={request.asset.image || '/default-asset.png'}
                      alt={request.asset.name}
                      className="w-12 h-12 rounded object-cover"
                      onError={(e) => {
                        e.target.src = '/default-asset.png';
                      }}
                    />
                    <div className="font-bold">{request.asset.name}</div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-outline">
                    {request.asset.type}
                  </span>
                </td>
                <td>
                  <div>
                    <div className="font-bold">{request.requester.name}</div>
                    <div className="text-sm opacity-50">{request.requester.email}</div>
                  </div>
                </td>
                <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                <td>
                  <div className="max-w-xs truncate">
                    {request.additionalNote || 'No additional note'}
                  </div>
                </td>
                <td>
                  <span className={`badge ${
                    request.status === 'pending' ? 'badge-warning' :
                    request.status === 'approved' ? 'badge-success' :
                    'badge-error'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="btn btn-square btn-sm btn-success"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="btn btn-square btn-sm btn-error"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            className="btn btn-sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {requests.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">No requests found</p>
        </div>
      )}
    </div>
  );
};

export default AllRequests; 