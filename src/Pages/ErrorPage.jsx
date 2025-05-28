import { Link, useRouteError } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-2xl text-gray-600 mb-4">Page Not Found</p>
                <p className="text-gray-500 mb-8">
                    {error?.message || "Sorry, we couldn't find the page you're looking for."}
                </p>
                <Link
                    to="/"
                    className="btn btn-primary inline-flex items-center gap-2"
                >
                    <FaHome /> Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
