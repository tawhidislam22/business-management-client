import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";

const MyTeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [newMember, setNewMember] = useState({ name: "", role: "" });
  const [loading, setLoading] = useState(true);

  // Fetch team members
  const fetchTeam = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/team?search=${search}&role=${roleFilter}`
      );
      setTeamMembers(data);
    } catch (error) {
      toast.error("Failed to fetch team members.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeam();
  }, [search, roleFilter]);

  // Add a new team member
  const addTeamMember = async () => {
    if (!newMember.name || !newMember.role) {
      toast.error("Name and role are required.");
      return;
    }
    try {
      const { data } = await axios.post("http://localhost:5000/team", newMember);
      toast.success(data.message);
      setNewMember({ name: "", role: "" });
      fetchTeam();
    } catch (error) {
      toast.error("Failed to add team member.");
    }
  };

  // Delete a team member
  const deleteTeamMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    try {
      const { data } = await axios.delete(`http://localhost:5000/team/${id}`);
      toast.success(data.message);
      fetchTeam();
    } catch (error) {
      toast.error("Failed to delete team member.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Team</h1>

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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="all">All Roles</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      {/* Add Member */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Member</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded-md w-full"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            className="border p-2 rounded-md w-full"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          />
          <button
            onClick={addTeamMember}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Team Members Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member) => (
            <tr key={member._id}>
              <td className="border p-2">{member.name}</td>
              <td className="border p-2">{member.role}</td>
              <td className="border p-2">
                <button
                  onClick={() => deleteTeamMember(member._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTeamPage;
