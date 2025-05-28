import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-base-200">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img src="/xyz-logo.png" alt="XYZ Company" className="h-10" />
              <span className="text-xl font-bold ml-2">XYZ</span>
            </Link>
            <p className="text-base-content/80">
              Empowering businesses with smart asset management solutions. Track, manage, and optimize your company resources efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-title">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/join-as-employee" className="hover:text-primary">Join as Employee</Link></li>
              <li><Link to="/join-as-hr" className="hover:text-primary">Join as HR</Link></li>
              <li><Link to="/login" className="hover:text-primary">Login</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="footer-title">Contact Us</h3>
            <ul className="space-y-2">
              <li>123 Business Street</li>
              <li>New York, NY 10001</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: contact@xyzcompany.com</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="footer-title">Follow Us</h3>
            <div className="flex gap-4 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-base-300 text-center">
          <p className="text-base-content/70">
            © {new Date().getFullYear()} XYZ Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 