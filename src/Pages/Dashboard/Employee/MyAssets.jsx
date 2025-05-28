import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';

const MyAssets = () => {
    const { user } = useAuth();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/my-assets?email=${user.email}`, {
                    withCredentials: true
                });
                setAssets(response.data);
            } catch (error) {
                console.error('Error fetching assets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, [user.email]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">My Assets</h2>
            
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Asset Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Request Date</th>
                            <th>Approval Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset, index) => (
                            <tr key={asset._id}>
                                <td>{index + 1}</td>
                                <td>{asset.name}</td>
                                <td>{asset.type}</td>
                                <td>
                                    <span className={`badge ${
                                        asset.status === 'approved' ? 'badge-success' :
                                        asset.status === 'pending' ? 'badge-warning' :
                                        'badge-error'
                                    }`}>
                                        {asset.status}
                                    </span>
                                </td>
                                <td>{new Date(asset.requestDate).toLocaleDateString()}</td>
                                <td>{asset.approvalDate ? new Date(asset.approvalDate).toLocaleDateString() : 'N/A'}</td>
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

export default MyAssets; 