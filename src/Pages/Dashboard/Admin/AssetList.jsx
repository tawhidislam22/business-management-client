import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AssetList = () => {
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        fetchAssets();
    }, [searchTerm, filterType, sortOrder]);

    const fetchAssets = async () => {
        try {
            const queryParams = new URLSearchParams({
                ...(searchTerm && { search: searchTerm }),
                ...(filterType && { type: filterType }),
                ...(sortOrder && { sort: sortOrder })
            });

            const response = await axios.get(`http://localhost:5000/assets?${queryParams}`, {
                withCredentials: true
            });
            setAssets(response.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await axios.delete(`http://localhost:5000/assets/${id}`, {
                    withCredentials: true
                });
                fetchAssets();
            } catch (error) {
                console.error('Error deleting asset:', error);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/dashboard/edit-asset/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">Asset List</h2>

            {/* Filters and Search */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search assets..."
                    className="input input-bordered w-full max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <select
                    className="select select-bordered w-full max-w-xs"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="returnable">Returnable</option>
                    <option value="non-returnable">Non-returnable</option>
                </select>

                <select
                    className="select select-bordered w-full max-w-xs"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="">Sort by Quantity</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>
            </div>

            {/* Assets Table */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Added Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset, index) => (
                            <tr key={asset._id}>
                                <td>{index + 1}</td>
                                <td>{asset.name}</td>
                                <td>{asset.type}</td>
                                <td>{asset.quantity}</td>
                                <td>{new Date(asset.addedDate).toLocaleDateString()}</td>
                                <td className="flex gap-2">
                                    <button
                                        className="btn btn-sm btn-info"
                                        onClick={() => handleEdit(asset._id)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-error"
                                        onClick={() => handleDelete(asset._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {assets.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No assets found.</p>
                </div>
            )}
        </div>
    );
};

export default AssetList; 