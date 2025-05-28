import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { FaUserMinus } from 'react-icons/fa';

const EmployeeList = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: { employees = [], totalEmployees = 0, packageLimit = 0 } = {}, refetch, isLoading } = useQuery({
    queryKey: ['employees', page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage
      });
      const res = await axiosSecure.get(`/employees?${params.toString()}`);
      return res.data;
    }
  });

  const handleRemoveEmployee = async (employeeId) => {
    try {
      await axiosSecure.delete(`/employees/${employeeId}`);
      toast.success('Employee removed successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove employee');
    }
  };

  const totalPages = Math.ceil(totalEmployees / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">My Employee List</h2>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Employees</div>
            <div className="stat-value">{totalEmployees}</div>
            <div className="stat-desc">Package Limit: {packageLimit}</div>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Assets Assigned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={employee.image || '/default-avatar.png'}
                          alt={employee.name}
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{employee.name}</div>
                      <div className="text-sm opacity-50">{employee.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-ghost badge-sm">
                    {employee.role}
                  </span>
                </td>
                <td>{new Date(employee.joinDate).toLocaleDateString()}</td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-bold">{employee.assetsCount || 0}</span>
                    <span className="text-sm opacity-50">Assets</span>
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleRemoveEmployee(employee._id)}
                    className="btn btn-square btn-sm btn-error"
                    title="Remove from team"
                  >
                    <FaUserMinus />
                  </button>
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

      {employees.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">No employees found</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeList; 