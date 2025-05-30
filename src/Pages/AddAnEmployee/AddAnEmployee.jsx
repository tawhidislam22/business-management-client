import React, { useState } from "react";
import axios from "axios";

const AddAnEmployee = ({ onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active",
    department: "",
    dob: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (name === "image") {
        setImagePreview(value); // Update image preview when image URL changes
      }
      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.department || !formData.dob || !formData.image) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/employees", formData);
      alert(response.data.message);
      onEmployeeAdded(); // Refresh the employee list
      setFormData({
        name: "",
        email: "",
        status: "active",
        department: "",
        dob: "",
        image: "",
      });
      setImagePreview(null); // Reset image preview
    } catch (err) {
      console.error("Error adding employee:", err);
      setError("Failed to add employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add New Employee</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Image preview */}
        {imagePreview && (
          <div>
            <label>Image Preview:</label>
            <img
              src={imagePreview}
              alt="Image Preview"
              style={{ maxWidth: "150px", maxHeight: "150px" }}
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
};

export default AddAnEmployee;
