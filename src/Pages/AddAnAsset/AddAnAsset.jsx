import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const AddAnAsset = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Add the dateAdded field with the current date
      const assetData = { ...data, dateAdded: new Date().toISOString() };

      // Send data to the server
      const response = await axios.post("http://localhost:5000/assets", assetData);
      if (response.status === 201) {
        alert("Asset added successfully!");
        reset(); // Reset form fields
      }
    } catch (error) {
      console.error("Error adding asset:", error.message);
      alert("Failed to add asset. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          Add New Asset
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Asset Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Asset Name</label>
            <input
              type="text"
              {...register("name", { required: "Asset name is required" })}
              placeholder="Enter asset name"
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Asset Type */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Asset Type</label>
            <select
              {...register("type", { required: "Asset type is required" })}
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value="">Select Type</option>
              <option value="returnable">Returnable</option>
              <option value="non-returnable">Non-returnable</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
            <input
              type="number"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Quantity must be at least 1" },
              })}
              placeholder="Enter quantity"
              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white rounded py-2 font-bold hover:bg-purple-600"
            >
              Add Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAnAsset;
