import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

// Replace with your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    memberLimit: 5,
    price: 5,
    features: [
      'Up to 5 team members',
      'Basic asset tracking',
      'Email support',
      'Basic analytics'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    memberLimit: 10,
    price: 8,
    features: [
      'Up to 10 team members',
      'Advanced asset tracking',
      'Priority email support',
      'Detailed analytics',
      'Custom reports'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    memberLimit: 20,
    price: 15,
    features: [
      'Up to 20 team members',
      'Premium asset tracking',
      '24/7 phone support',
      'Advanced analytics',
      'Custom reports',
      'API access'
    ]
  }
];

const Payment = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: currentPackage = {}, isLoading } = useQuery({
    queryKey: ['current-package'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users/current-package');
      return res.data;
    }
  });

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Package</h2>

      {/* Current Package Info */}
      <div className="bg-base-200 rounded-box p-6 mb-8">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Current Package</h3>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Member Limit</div>
              <div className="stat-value">{currentPackage.memberLimit || 0}</div>
              <div className="stat-desc">Current Members: {currentPackage.currentMembers || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Selection */}
      {!selectedPackage ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer
                ${currentPackage.memberLimit === pkg.memberLimit ? 'border-2 border-primary' : ''}`}
              onClick={() => handlePackageSelect(pkg)}
            >
              <div className="card-body">
                <h3 className="card-title justify-center text-2xl">{pkg.name}</h3>
                <div className="text-center my-4">
                  <span className="text-4xl font-bold">${pkg.price}</span>
                  <span className="text-base-content/60">/month</span>
                </div>
                <div className="divider"></div>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="card-actions justify-center mt-6">
                  <button
                    className={`btn btn-primary btn-block ${
                      currentPackage.memberLimit === pkg.memberLimit ? 'btn-disabled' : ''
                    }`}
                    disabled={currentPackage.memberLimit === pkg.memberLimit}
                  >
                    {currentPackage.memberLimit === pkg.memberLimit ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="bg-base-100 shadow-xl rounded-box p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Payment Details</h3>
            <div className="mb-6">
              <p className="text-lg">Selected Package: <span className="font-bold">{selectedPackage.name}</span></p>
              <p className="text-lg">Amount: <span className="font-bold">${selectedPackage.price}</span></p>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                package={selectedPackage}
                onSuccess={() => {
                  navigate('/dashboard');
                }}
              />
            </Elements>
          </div>
          <button
            className="btn btn-ghost btn-block"
            onClick={() => setSelectedPackage(null)}
          >
            Choose Another Package
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;