import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/employees", {
        params: { search, status, department },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees on mount and when filters change
  useEffect(() => {
    fetchEmployees();
  }, [search, status, department]);

  // Handle Employee actions (View, Edit, Delete)
  const handleView = (id) => {
    console.log("View employee details for ID:", id);
    // You could navigate to a detailed employee view page or show a modal
  };

  const handleEdit = (id) => {
    console.log("Edit employee details for ID:", id);
    // Navigate to the edit page or show an editable form
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees(); // Reload the list after deleting
    } catch (error) {
      console.error("Error deleting employee:", error.message);
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
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleView(employee._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(employee._id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
