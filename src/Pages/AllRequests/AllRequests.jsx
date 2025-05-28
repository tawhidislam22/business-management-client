import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useDebounce from "../../hooks/useDebounce";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const AllRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
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
      const response = await axiosSecure.get("/allRequests", {
        params: { 
          search: debouncedSearch, 
          status, 
          email,
          hrEmail: user?.email 
        },
      });
      setRequests(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests");
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };  // Fetch requests on mount and when filters change
  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [debouncedSearch, status, email, user]);

  // Approve Request
  const handleApprove = async (requestId, assetName) => {
    try {
      // First, check if user is authenticated
      if (!user?.email) {
        toast.error("You must be logged in to approve requests");
        return;
      }

      const result = await Swal.fire({
        title: 'Confirm Approval',
        text: `Are you sure you want to approve the request for ${assetName}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const response = await axiosSecure.put(`/allRequests/${requestId}/approve`, {
              hrEmail: user.email,
              approvalDate: new Date().toISOString()
            });
            return response.data;
          } catch (error) {
            Swal.showValidationMessage(
              `Request failed: ${error.response?.data?.message || error.message}`
            );
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (result.isConfirmed) {
        if (result.value.success) {
          toast.success('Request approved successfully');
          await fetchRequests();
        } else {
          toast.error(result.value.message || 'Failed to approve request');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
      console.error("Error approving request:", error);
    }
  };

  // Reject Request
  const handleReject = async (requestId) => {
    try {
      const { value: rejectReason } = await Swal.fire({
        title: 'Reject Request',
        input: 'text',
        inputLabel: 'Reason for rejection',
        inputPlaceholder: 'Enter the reason for rejection',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Please provide a reason for rejection'
          }
        }
      });

      if (rejectReason) {
        const response = await axiosSecure.put(`/allRequests/${requestId}/reject`, {
          hrEmail: user?.email,
          rejectReason
        });
        
        if (response.data.success) {
          toast.success('Request rejected successfully');
          fetchRequests();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
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
                    <>                      <button
                        onClick={() => handleApprove(request._id, request.name)}
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
