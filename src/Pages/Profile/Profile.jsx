import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Profile = () => {
    const navigate = useNavigate();
    const { user, updateUserProfile } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const axiosPublic = useAxiosPublic();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            // Prepare the image for upload
            const formData = new FormData();
            formData.append("image", data.image[0]);

            // Upload the image to ImageBB
            const res = await axiosPublic.post(image_hosting_api, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                // Update the user's profile with the new data
                await updateUserProfile(data.name, res.data.data.display_url);
                console.log("Profile updated successfully!");
            } else {
                console.error("Image upload failed:", res.data.error);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setEditMode(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold">
                    Welcome, {user?.displayName || "User"}!
                </h1>
            </div>
            <div className="flex flex-col items-center mt-8">
                <img
                    src={user?.photoURL || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full shadow-lg"
                />
                {!editMode ? (
                    <>
                        <h2 className="text-2xl font-bold mt-4">{user?.displayName || "Name"}</h2>
                        <p className="text-gray-600 mt-2">{user?.email || "Email"}</p>
                        <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => setEditMode(true)}
                        >
                            Edit Profile
                        </button>
                    </>
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-4 w-full max-w-md flex flex-col"
                    >
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            {...register("name", { required: true })}
                            type="text"
                            placeholder="Name"
                            className="input input-bordered w-full max-w-xs"
                        />
                        {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

                        <label className="block text-sm font-medium text-gray-700 mt-4">
                            Photo
                        </label>
                        <div>
                            <label className="form-control w-full max-w-xs">
                                <input
                                    type="file"
                                    {...register("image", { required: true })}
                                    className="file-input file-input-bordered w-full max-w-xs"
                                />
                            </label>
                            {errors.image && <p className="text-red-500 text-sm">Image is required</p>}
                        </div>

                        <div className="mt-4 flex justify-between">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                onClick={() => setEditMode(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
