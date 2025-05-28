import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const CheckoutForm = ({ package: selectedPackage, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedPackage?.price) {
      axiosSecure.post('/create-payment-intent', {
        price: selectedPackage.price
      })
        .then(res => {
          setClientSecret(res.data.clientSecret);
        })
        .catch(err => {
          setError('Failed to initialize payment. Please try again.');
          console.error('Payment intent error:', err);
        });
    }
  }, [selectedPackage, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName || 'Anonymous',
              email: user?.email
            }
          }
        }
      );

      if (paymentError) {
        setError(paymentError.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Save payment info to database
        const paymentInfo = {
          email: user?.email,
          transactionId: paymentIntent.id,
          price: selectedPackage.price,
          packageName: selectedPackage.name,
          memberLimit: selectedPackage.memberLimit,
          date: new Date()
        };

        try {
          await axiosSecure.post('/payments', paymentInfo);
          toast.success('Payment successful!');
          onSuccess?.();
        } catch (err) {
          toast.error('Payment recorded but failed to update system. Please contact support.');
          console.error('Payment record error:', err);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-control">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="p-4 border rounded-lg bg-base-200"
        />
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        className={`btn btn-primary btn-block ${processing ? 'loading' : ''}`}
        disabled={!stripe || !clientSecret || processing}
      >
        {processing ? 'Processing...' : `Pay $${selectedPackage.price}`}
      </button>
    </form>
  );
};

export default CheckoutForm; 