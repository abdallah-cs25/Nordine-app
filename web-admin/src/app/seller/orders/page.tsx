'use client';

import React, { useEffect, useState } from 'react';
import SellerLayout from '@/components/SellerLayout';
// We'll use a simple fetch or api utility if we set one up. 
// For now let's use the api utility I just created.
import { api } from '@/utils/api';

interface Order {
    id: number;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: any[];
}

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // In a real app we'd filter for this seller
            // The backend /api/orders might return all if admin, or filtered if seller
            // For now let's assume the backend handles it or we filter client side if needed
            // But getting *all* orders might be heavy. 
            // The backend actually filters by `req.user` if Role is Seller in my implementation.
            const data = await api.get('/orders?limit=100');
            setOrders(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (id: number) => {
        // Navigate to details or open modal
        // For now just alert or log
        console.log('View order', id);
        // router.push(\\`/seller/orders/${id}\\`); // If we have a details page
    };

    return (
        <SellerLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">My Orders</h1>

                {loading ? (
                    <div className="text-center py-10">Loading orders...</div>
                ) : error ? (
                    <div className="text-red-500 py-10">{error}</div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-600">Order ID</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Customer</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Total</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">#{order.id}</td>
                                            <td className="p-4">{order.customer_name || 'Guest'}</td>
                                            <td className="p-4 font-medium">{Number(order.total_amount).toLocaleString()} DZD</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold
                                                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500 text-sm">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleViewOrder(order.id)}
                                                    className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
