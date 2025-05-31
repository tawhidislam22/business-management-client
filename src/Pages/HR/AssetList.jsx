import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
const AssetList = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { user } = useAuth();

  const { data: { assets = [], totalAssets = 0 } = {}, refetch, isLoading } = useQuery({
    queryKey: ['assets', searchTerm, stockFilter, typeFilter, sortOrder, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        stock: stockFilter,
        type: typeFilter,
        sort: sortOrder,
        page,
        limit: itemsPerPage
      });
      const res = await axiosSecure.get(`/assets/${user?.email}?${params.toString()}`);
      return res.data;
    }
  });

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/assets/${id}`);
      toast.success('Asset deleted successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete asset');
    }
  };

  const totalPages = Math.ceil(totalAssets / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Asset List</h2>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search by name"
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-control">
          <select
            className="select select-bordered w-full"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock</option>
            <option value="available">In Stock</option>
            <option value="out">Out of Stock</option>
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

        <div className="form-control">
          <select
            className="select select-bordered w-full"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Quantity (High to Low)</option>
            <option value="asc">Quantity (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets?.map((asset) => (
              <tr key={asset._id}>
                <td>
                  <div className="flex items-center gap-2">
                    <img
                      src={asset?.image || '/default-asset.png'}
                      alt={asset?.name}
                      className="w-12 h-12 rounded object-cover"
                      onError={(e) => {
                        e.target.src = '/default-asset.png';
                      }}
                    />
                    <div>
                      <div className="font-bold">{asset?.name}</div>
                          <div className="text-sm opacity-50">{asset?.description}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-outline">
                    {asset?.type}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    asset?.quantity > 10 ? 'badge-success' :
                    asset?.quantity > 0 ? 'badge-warning' :
                    'badge-error'
                  }`}>
                    {asset?.quantity}
                  </span>
                </td>
                <td>{new Date(asset?.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/update-asset/${asset._id}`)}
                      className="btn btn-square btn-sm btn-primary"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(asset._id)}
                      className="btn btn-square btn-sm btn-error"
                    >
                      <FaTrash />
                    </button>
                  </div>
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

      {assets?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">No assets found</p>
        </div>
      )}
    </div>
  );
};

export default AssetList; 