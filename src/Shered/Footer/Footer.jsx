import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Business Asset Management</h3>
                        <p className="text-gray-400">Streamline your company's asset management and employee resources with our comprehensive solution.</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-orange-400">Home</Link></li>
                            <li><Link to="/dashboard" className="text-gray-400 hover:text-orange-400">Dashboard</Link></li>
                            <li><Link to="/login" className="text-gray-400 hover:text-orange-400">Login</Link></li>
                            <li><Link to="/joinAsEmployee" className="text-gray-400 hover:text-orange-400">Join as Employee</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="text-gray-400 space-y-2">
                            <li>Email: info@bam.com</li>
                            <li>Phone: (123) 456-7890</li>
                            <li>Address: 123 Business St, Suite 100</li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-orange-400">
                                <FaFacebook size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-orange-400">
                                <FaTwitter size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-orange-400">
                                <FaLinkedin size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-orange-400">
                                <FaGithub size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Business Asset Management. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;