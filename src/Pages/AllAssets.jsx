import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AllAssets = () => {
    const { user } = useAuth();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        availability: ''
    });
    const [sortOrder, setSortOrder] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    // Fetch user info to get company name
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/${user.email}`);
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
                toast.error('Failed to fetch user information');
            }
        };
        if (user?.email) {
            fetchUserInfo();
        }
    }, [user]);

    // Fetch assets based on company name
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                if (!userInfo?.companyName) return;
                
                const response = await axios.get(`http://localhost:5000/all-assets/${userInfo.companyName}`);
                setAssets(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching assets:', error);
                toast.error('Failed to fetch assets');
                setLoading(false);
            }
        };
        
        if (userInfo?.companyName) {
            fetchAssets();
        }
    }, [userInfo]);

    // Handle asset request
    const handleRequest = async (asset) => {
        try {
            const requestData = {
                assetId: asset._id,
                assetName: asset.name,
                type: asset.type,
                requesterEmail: user.email,
                requesterName: user.displayName,
                requestDate: new Date().toISOString(),
                status: 'pending',
                companyName: userInfo.companyName
            };

            await axios.post('http://localhost:5000/requests', requestData);
            toast.success('Request submitted successfully');
        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error('Failed to submit request');
        }
    };

    // Filter and sort assets
    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filters.type || asset.type === filters.type;
        const matchesAvailability = !filters.availability || 
            (filters.availability === 'available' ? asset.quantity > 0 : asset.quantity === 0);
        
        return matchesSearch && matchesType && matchesAvailability;
    }).sort((a, b) => {
        if (!sortOrder) return 0;
        return sortOrder === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                Company Assets
            </h1>

            {/* Search and Filter Section */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="input pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="input"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">All Types</option>
                    <option value="returnable">Returnable</option>
                    <option value="non-returnable">Non-returnable</option>
                </select>

                <select
                    className="input"
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                >
                    <option value="">All Availability</option>
                    <option value="available">Available</option>
                    <option value="out-of-stock">Out of Stock</option>
                </select>

                <select
                    className="input"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="">Sort by Quantity</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => (
                    <div key={asset._id} className="card p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    {asset.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Type: {asset.type}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                asset.quantity > 0 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                                {asset.quantity > 0 ? 'Available' : 'Out of Stock'}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Quantity: {asset.quantity}
                            </p>
                            {asset.specifications && (
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Specifications: {asset.specifications}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => handleRequest(asset)}
                            disabled={asset.quantity === 0}
                            className={`mt-4 w-full btn-primary ${
                                asset.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            Request Asset
                        </button>
                    </div>
                ))}
            </div>

            {filteredAssets.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                        No assets found matching your criteria.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AllAssets; 