import React, { useState, useEffect } from "react";
import axios from "axios";
import useDebounce from "./useDebounce"; // Import the custom debounce hook

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500); // Debounce the search term by 500ms

  // Fetch all requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/allRequests", {
        params: { search: debouncedSearch, status, email },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests on mount and when filters change
  useEffect(() => {
    fetchRequests();
  }, [debouncedSearch, status, email]);

  // Approve or Reject Request
  const handleApprove = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/allRequests/${requestId}/approve`);
      fetchRequests(); // Reload the requests after approving
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/allRequests/${requestId}/reject`);
      fetchRequests(); // Reload the requests after rejecting
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">All Requests</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="returned">Returned</option>
        </select>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Filter by email"
          className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200"
        />
        <button
          onClick={fetchRequests}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Filter
        </button>
      </div>

      {/* Requests Table */}
      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No requests found.</p>
      ) : (
        <table className="table-auto w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              <th className="px-4 py-2">Asset Name</th>
              <th className="px-4 py-2">Asset Type</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Requester Name</th>
              <th className="px-4 py-2">Request Date</th>
              <th className="px-4 py-2">Additional Note</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-t dark:border-gray-700">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{request.name}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{request.type}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{request.userEmail}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{request.userName}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  {new Date(request.requestDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{request.additionalNote}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{request.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllRequests;
