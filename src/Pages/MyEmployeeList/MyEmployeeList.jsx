import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useDebounce from "../../hooks/useDebounce";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const EmployeeList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500); // Debounce the search term by 500ms
  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axiosSecure.get("/employees", {
        params: { 
          search: debouncedSearch, 
          status, 
          department,
          email: user?.email 
        },
      });
      setEmployees(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching employees");
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch employees on mount and when filters change
  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [debouncedSearch, status, department, user]);
  // Handle Employee actions (View, Edit, Delete)
  const handleView = async (employee) => {
    await Swal.fire({
      title: 'Employee Details',
      html: `
        <div class="text-left">
          <p><strong>Name:</strong> ${employee.name}</p>
          <p><strong>Email:</strong> ${employee.email}</p>
          <p><strong>Department:</strong> ${employee.department}</p>
          <p><strong>Status:</strong> ${employee.status}</p>
          <p><strong>Joining Date:</strong> ${new Date(employee.dateOfJoining).toLocaleDateString()}</p>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false
    });
  };

  const handleEdit = async (employee) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Employee',
      html: `
        <input id="name" class="swal2-input" placeholder="Name" value="${employee.name}">
        <select id="department" class="swal2-input">
          <option value="hr" ${employee.department === 'hr' ? 'selected' : ''}>HR</option>
          <option value="engineering" ${employee.department === 'engineering' ? 'selected' : ''}>Engineering</option>
          <option value="marketing" ${employee.department === 'marketing' ? 'selected' : ''}>Marketing</option>
        </select>
        <select id="status" class="swal2-input">
          <option value="active" ${employee.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="inactive" ${employee.status === 'inactive' ? 'selected' : ''}>Inactive</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          name: document.getElementById('name').value,
          department: document.getElementById('department').value,
          status: document.getElementById('status').value
        };
      }
    });

    if (formValues) {
      try {
        const response = await axiosSecure.put(`/employees/${employee._id}`, formValues);
        if (response.data.success) {
          toast.success('Employee updated successfully');
          fetchEmployees();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update employee');
      }
    }
  };
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await axiosSecure.delete(`/employees/${id}`);
        if (response.data.success) {
          Swal.fire(
            'Deleted!',
            'Employee has been removed.',
            'success'
          );
          fetchEmployees();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting employee");
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Employee List</h2>

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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="">All Departments</option>
          <option value="hr">HR</option>
          <option value="engineering">Engineering</option>
          <option value="marketing">Marketing</option>
          {/* Add more departments as needed */}
        </select>
        <button
          onClick={fetchEmployees}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Filter
        </button>
      </div>

      {/* Employee Table */}
      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No employees found.</p>
      ) : (
        <table className="table-auto w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              <th className="px-4 py-2">Employee Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date of Joining</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id} className="border-t dark:border-gray-700">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{employee.name}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{employee.email}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{employee.department}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{employee.status}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  {new Date(employee.dateOfJoining).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex gap-2">                  <button
                    onClick={() => handleView(employee)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(employee)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
