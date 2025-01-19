import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from '../../../Hooks/useAxiosSecure'
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const CheckoutFrom = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error,setError]=useState('')
    const [clientSecret,setClientSecret]=useState('')
    const [transactionId,setTransactionId]=useState('')
    const axiosSecure=useAxiosSecure()
    const [cart,refetch]=useCart()
    const {user}=useAuth()
    const navigate=useNavigate()
    const totalPrice=cart.reduce((total,item)=>total+item.price,0)
    useEffect(()=>{
       if(totalPrice>0){
        axiosSecure.post('/create-payment-intent',{price:totalPrice})
        .then(res=>{
            setClientSecret(res.data.clientSecret)
        })
       }
    },[axiosSecure,totalPrice])
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!stripe || !elements) {
            return;
        }
        const card = elements.getElement(CardElement);
        if (card === null) {
            return;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });
        if(error){
            console.log(error)
            setError(error)
        }else{
            console.log(paymentMethod)
            setError('')
        }
        const {paymentIntent,error:confirmError}=await stripe.confirmCardPayment(clientSecret,{
            payment_method:{
                card:card,
                billing_details:{
                    email:user?.email || 'anonymous',
                    name:user?.displayName || 'anonymous'
                }
            }
        })
        if(confirmError){
            console.log('confirm error')
        }else{
            console.log('payment intent',paymentIntent)
            if(paymentIntent.status==='succeeded'){
                setTransactionId(paymentIntent.id)
                const payment={
                    email:user.email,
                    price:totalPrice,
                    transactionId:paymentIntent.id,
                    data:new Date(),
                    cartIds:cart.map(item=>item._id),
                    menuItemIds:cart.map(item=>item.menuId),
                    status:'pending'
                }
                const res=await axiosSecure.post('/payments',payment)
                refetch()
                if(res.data?.paymentResult?.insertedId){
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your payment is successful",
                        showConfirmButton: false,
                        timer: 1500
                      });
                      navigate('/dashboard/paymentHistory')
                }
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                />
                <button className="btn btn-primary " type="submit" disabled={!stripe || !clientSecret}>
                    Pay
                </button>
                <p className="text-red-600">{error.message}</p>
                {
                    transactionId && <p className="text-green-500">your transaction id is {transactionId}</p>
                }
            </form>
        </div>
    );
};

export default CheckoutFrom;