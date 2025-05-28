import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    
    const { data: payment = [], isLoading } = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/payments/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6">Payment History</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Price</th>
                            <th>Transaction Id</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            payment.map((item, index) => <tr key={item._id}>                                <th>{index + 1}</th>
                                <td>${item.price}</td>
                                <td>{item.transactionId}</td>
                                <td>
                                    <span className={`badge badge-${
                                        item.status === 'completed' ? 'success' : 'warning'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
                {payment.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No payment history found
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;