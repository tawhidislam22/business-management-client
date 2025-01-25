import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AssetDetailsPDF from "./AssetDetailsPDF";
import useAuth from "../../Hooks/useAuth";
import toast from "react-hot-toast"; // Import toast

const MyAssets = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Fetch assets data using React Query
  const { data: myAssets, isLoading, isError } = useQuery({
    queryKey: ["myAssets", search, filterStatus, filterType],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5000/allRequests/${user.email}?search=${search}&status=${filterStatus}&type=${filterType}`
      );
      if (!response.ok) throw new Error("Failed to fetch assets");
      return response.json();
    },
  });

  const handleCancelRequest = async (assetId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/allRequests/${user.email}/${assetId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast.success("Request canceled successfully!"); // Using toast notification
      } else {
        toast.error("Failed to cancel the request."); // Using toast notification
      }
    } catch (error) {
      toast.error("An error occurred while canceling the request."); // Using toast notification
    }
  };

  const handleReturnAsset = async (assetId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/allRequests/${user.email}/${assetId}/return`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        toast.success("Asset returned successfully!"); // Using toast notification
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to return the asset."); // Using toast notification
      }
    } catch (error) {
      toast.error("An error occurred while returning the asset."); // Using toast notification
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading assets!</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Assets</h1>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by asset name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/3"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/4"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/4"
        >
          <option value="all">All Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>
      </div>

      {/* Assets Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3">Asset Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Request Date</th>
              <th className="p-3">Approval Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {myAssets.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-3">
                  No assets found.
                </td>
              </tr>
            ) : (
              myAssets.map((asset) => (
                <tr key={asset.id} className="border-t">
                  <td className="p-3">{asset.name}</td>
                  <td className="p-3 capitalize">{asset.type}</td>
                  <td className="p-3">{new Date(asset.requestDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    {asset.approvalDate
                      ? new Date(asset.approvalDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3 capitalize">{asset.status}</td>
                  <td className="p-3 flex gap-2">
                    {asset.status === "pending" && (
                      <button
                        onClick={() => handleCancelRequest(asset._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    )}

                    {asset.status === "approved" && (
                      <>
                        <PDFDownloadLink
                          document={<AssetDetailsPDF asset={asset} />}
                          fileName={`${asset.name}-details.pdf`}
                        >
                          <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                            Print
                          </button>
                        </PDFDownloadLink>
                        {asset.type === "Returnable" && (
                          <button
                            onClick={() => handleReturnAsset(asset._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                          >
                            Return
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAssets;
