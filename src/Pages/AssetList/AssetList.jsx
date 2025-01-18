import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [newAsset, setNewAsset] = useState({ name: "", type: "", availability: true });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

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

  // Add new asset
  const addAsset = async () => {
    if (!newAsset.name || !newAsset.type) {
      toast.error("Name and type are required.");
      return;
    }
    try {
      const { data } = await axios.post("http://localhost:5000/assets", newAsset);
      toast.success(data.message);
      setNewAsset({ name: "", type: "", availability: true });
      fetchAssets();
    } catch (error) {
      toast.error("Failed to add asset.");
    }
  };

  // Delete asset
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

      {/* Add Asset */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Asset</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded-md w-full"
            value={newAsset.name}
            onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Type (e.g., returnable)"
            className="border p-2 rounded-md w-full"
            value={newAsset.type}
            onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
          />
          <button
            onClick={addAsset}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Asset Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Availability</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset._id}>
              <td className="border p-2">{asset.name}</td>
              <td className="border p-2">{asset.type}</td>
              <td className="border p-2">{asset.availability ? "Yes" : "No"}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteAsset(asset._id)}
                  className="text-red-500 hover:underline"
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
    </div>
  );
};

export default AssetList;
