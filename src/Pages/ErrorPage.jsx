import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {error?.message || 'Sorry, we couldn\'t find the page you\'re looking for.'}
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
