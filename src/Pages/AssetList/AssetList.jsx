import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Fetch assets
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/assets?search=${search}&type=${typeFilter}&page=${page}&limit=10`
      );
      setAssets(data.assets);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch assets.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
  }, [search, typeFilter, page]);

  // Open modal and set selected asset
  const openUpdateModal = (asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedAsset(null);
    setIsModalOpen(false);
  };

  // Delete an asset
  const deleteAsset = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      const { data } = await axios.delete(`http://localhost:5000/assets/${id}`);
      toast.success(data.message);
      fetchAssets();
    } catch (error) {
      toast.error("Failed to delete asset.");
    }
  };

  // Update form submission
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { data: response } = await axios.put(
        `http://localhost:5000/assets/${selectedAsset._id}`,
        data
      );
      toast.success(response.message);
      fetchAssets();
      closeModal();
    } catch (error) {
      toast.error("Failed to update asset.");
    }
  };

  useEffect(() => {
    if (selectedAsset) {
      reset({
        name: selectedAsset.name,
        type: selectedAsset.type,
        quantity: selectedAsset.quantity,
      });
    }
  }, [selectedAsset, reset]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Asset List</h1>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name..."
            className="border pl-10 p-2 rounded-md w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute top-3 left-3 text-gray-500" />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="all">All Types</option>
          <option value="returnable">Returnable</option>
          <option value="non-returnable">Non-Returnable</option>
        </select>
      </div>

      {/* Asset Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Product Name</th>
            <th className="border p-2">Product Type</th>
            <th className="border p-2">Product Quantity</th>
            <th className="border p-2">Date Added</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset._id}>
              <td className="border p-2">{asset.name}</td>
              <td className="border p-2">{asset.type}</td>
              <td className="border p-2">{asset.quantity}</td>
              <td className="border p-2">
                {new Date(asset.dateAdded).toLocaleDateString()}
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => openUpdateModal(asset)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteAsset(asset._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-4 py-2 rounded-md ${
              page === index + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-2xl font-bold mb-4">Update Asset</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Product Name</label>
                <input
                  {...register("name", { required: true })}
                  className="border p-2 rounded-md w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">Name is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Product Type</label>
                <input
                  {...register("type", { required: true })}
                  className="border p-2 rounded-md w-full"
                />
                {errors.type && (
                  <p className="text-red-500 text-sm">Type is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Product Quantity
                </label>
                <input
                  type="number"
                  {...register("quantity", { required: true })}
                  className="border p-2 rounded-md w-full"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">Quantity is required</p>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetList;
