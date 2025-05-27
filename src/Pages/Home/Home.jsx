import { Link } from 'react-router-dom';
import { FaUserTie, FaClipboardList, FaLaptop } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-20">
                <div className="container mx-auto px-6">
                    <h1 className="text-5xl font-bold mb-4">Business Asset Management System</h1>
                    <p className="text-xl mb-8">Streamline your company's asset management and employee resources</p>
                    <Link to="/dashboard" className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-100 transition duration-300">
                        Get Started
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <FaUserTie className="text-5xl text-orange-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
                        <p className="text-gray-600">Efficiently manage your workforce with comprehensive employee profiles and team structures.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <FaLaptop className="text-5xl text-orange-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Asset Tracking</h3>
                        <p className="text-gray-600">Keep track of company assets, their allocation, and maintenance status in real-time.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <FaClipboardList className="text-5xl text-orange-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Request Management</h3>
                        <p className="text-gray-600">Streamlined process for asset requests and approvals between employees and HR.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-100 py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                    <p className="text-gray-600 mb-8">Join our platform and transform your business asset management today.</p>
                    <Link to="/dashboard" className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;