import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';

const AddEmployee = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: { employees = [], totalEmployees = 0, packageInfo = {} } = {}, refetch, isLoading } = useQuery({
    queryKey: ['available-employees', page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
        unaffiliated: true
      });
      const res = await axiosSecure.get(`/employees/available?${params.toString()}`);
      return res.data;
    }
  });

  const handleAddEmployee = async (employeeId) => {
    try {
      if (packageInfo.currentCount >= packageInfo.limit) {
        toast.error('Package limit reached. Please upgrade your package.');
        return;
      }

      await axiosSecure.post(`/employees/add/${employeeId}`);
      toast.success('Employee added successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add employee');
    }
  };

  const handleAddSelectedEmployees = async () => {
    try {
      if (packageInfo.currentCount + selectedEmployees.length > packageInfo.limit) {
        toast.error('Package limit will be exceeded. Please upgrade your package.');
        return;
      }

      await axiosSecure.post('/employees/add-multiple', { employeeIds: selectedEmployees });
      toast.success('Selected employees added successfully');
      setSelectedEmployees([]);
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add selected employees');
    }
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      }
      return [...prev, employeeId];
    });
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
      {/* Package Info Section */}
      <div className="bg-base-200 rounded-box p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Package Information</h2>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Current Employees</div>
                <div className="stat-value">{packageInfo.currentCount}</div>
                <div className="stat-desc">Limit: {packageInfo.limit}</div>
              </div>
            </div>
          </div>
          <Link to="/payment" className="btn btn-primary">
            Upgrade Package
          </Link>
        </div>
      </div>

      {/* Available Employees Section */}
      <div className="bg-base-100 rounded-box p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Available Employees</h3>
          {selectedEmployees.length > 0 && (
            <button
              onClick={handleAddSelectedEmployees}
              className="btn btn-primary"
            >
              Add Selected Members ({selectedEmployees.length})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedEmployees.length === employees.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEmployees(employees.map(emp => emp._id));
                        } else {
                          setSelectedEmployees([]);
                        }
                      }}
                    />
                  </label>
                </th>
                <th>Employee</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedEmployees.includes(employee._id)}
                        onChange={() => handleSelectEmployee(employee._id)}
                      />
                    </label>
                  </td>
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
                    <div className="flex flex-wrap gap-1">
                      {employee.skills?.map((skill, index) => (
                        <span key={index} className="badge badge-ghost badge-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{employee.experience || 'Not specified'}</td>
                  <td>
                    <button
                      onClick={() => handleAddEmployee(employee._id)}
                      className="btn btn-square btn-sm btn-primary"
                      title="Add to team"
                      disabled={packageInfo.currentCount >= packageInfo.limit}
                    >
                      <FaUserPlus />
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
            <p className="text-lg text-gray-500">No available employees found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEmployee; 