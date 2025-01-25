import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"; // Import toast for notifications
import useAuth from "../../Hooks/useAuth";

const RequestAssetPage = () => {
  const { user } = useAuth(); 
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true); // Reset loading state when search or page changes
    axios
      .get(`http://localhost:5000/assets?search=${search}&page=${page}&limit=10`)
      .then((res) => {
        setLoading(false);
        setAssets(res.data.assets);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Failed to load assets.");
      });
  }, [search, page]);

  const handleRequest = async (asset) => {
    if (!user) {
      toast.error("You must be logged in to request an asset.");
      return;
    }

    const additionalNote = prompt("Add an additional note for this request (optional):");

    const requestData = {
      assetId: asset._id,
      name: asset.name,
      type: asset.type,
      quantity: asset.quantity,
      userEmail: user.email,
      userName: user.displayName || "Anonymous",
      requestDate: new Date().toISOString(),
      additionalNote: additionalNote || "",
      status: "pending",
    };

    try {
      const response = await axios.post(`http://localhost:5000/allRequests`, requestData);
      if (response.status === 201) {
        toast.success("Asset request submitted successfully!");
        console.log("Response:", response.data);
      }
    } catch (error) {
      toast.error("Failed to submit the asset request.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-gray-200">
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="#A855F7"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 pt-20 md:pt-28 bg-slate-100 dark:bg-gray-900 dark:text-gray-200 transition duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div className="relative w-full md:w-3/4 lg:w-1/2">
            <input
              type="text"
              placeholder="Search by title"
              className="border border-gray-700 outline-none pl-12 py-2 rounded-full w-full bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 shadow-sm focus:ring focus:ring-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute top-3 left-4 text-purple-500 dark:text-purple-400" />
          </div>
        </div>

        {/* No Results Found */}
        {assets.length === 0 && search && (
          <div className="text-center text-gray-500 dark:text-gray-400 mb-6">
            No assets found for "{search}".
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Asset Name</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Asset Type</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Availability</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{asset.name}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{asset.type}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    {asset.availability ? "Available" : "Unavailable"}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                    <button
                      onClick={() => handleRequest(asset)}
                      className="text-purple-500 hover:underline"
                      disabled={!asset.availability}
                    >
                      Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`px-4 py-2 text-lg font-medium rounded-full transition duration-300 ${page === index + 1
                  ? "bg-purple-500 text-gray-900 dark:bg-purple-500 dark:text-gray-900 shadow-lg"
                  : "bg-gray-800 text-gray-300 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600"
                }`}
              disabled={page === index + 1} // Disable the current page button
              aria-label={`Page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestAssetPage;
