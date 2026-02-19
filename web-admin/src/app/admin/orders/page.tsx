'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

interface Order {
    id: number;
    user_id: number;
    store_id: number;
    store_name?: string; // from join
    driver_id?: number;
    total_amount: number;
    status: string;
    delivery_address: string;
    created_at: string;
    items?: any[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'badge-success';
            case 'OUT_FOR_DELIVERY': return 'badge-info';
            case 'PREPARING': return 'badge-warning';
            case 'PENDING': return 'badge-warning';
            case 'CANCELLED': return 'badge-danger';
            default: return 'badge-neutral';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter ? order.status === statusFilter : true;
        const matchesDate = dateFilter ? order.created_at.startsWith(dateFilter) : true;
        return matchesStatus && matchesDate;
    });

    return (
        <AdminLayout>
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Track and manage all marketplace orders</p>
                    </div>
                    <div className="flex space-x-2">
                        <select
                            className="form-input w-auto"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <input
                            type="date"
                            className="form-input w-auto"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="card p-6"><div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-12 w-full" />)}</div></div>
                ) : (
                    <div className="table-container card">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Store</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="font-medium text-gray-900">#{order.id}</td>
                                        <td>{order.store_name || `Store #${order.store_id}`}</td>
                                        <td className="font-semibold">{Number(order.total_amount).toLocaleString()} DZD</td>
                                        <td>
                                            <span className={`badge ${getStatusColor(order.status)}`}>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="empty-state">🛠 No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ maxWidth: '42rem' }}>
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Order Details #{selectedOrder.id}</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Order Info</h3>
                                    <p><span className="text-gray-500">Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                    <p><span className="text-gray-500">Status:</span> {selectedOrder.status.replace(/_/g, ' ')}</p>
                                    <p><span className="text-gray-500">Total:</span> {Number(selectedOrder.total_amount).toLocaleString()} DZD</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Customer & Delivery</h3>
                                    <p><span className="text-gray-500">User ID:</span> {selectedOrder.user_id}</p>
                                    <p><span className="text-gray-500">Address:</span> {selectedOrder.delivery_address}</p>
                                    {selectedOrder.driver_id && <p><span className="text-gray-500">Driver ID:</span> {selectedOrder.driver_id}</p>}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-700 mb-4">Items</h3>
                                {/* If we had items in the order object, we would map them here. 
                                    Currently the getAllOrders endpoint might not join items by default depending on implementation.
                                    For now, showing a placeholder or if items exist.
                                */}
                                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-500">
                                                <th className="pb-2">Product</th>
                                                <th className="pb-2">Quantity</th>
                                                <th className="pb-2">Price</th>
                                                <th className="pb-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items.map((item: any, idx: number) => (
                                                <tr key={idx} className="border-b last:border-0">
                                                    <td className="py-2">{item.product_name}</td>
                                                    <td className="py-2">{item.quantity}</td>
                                                    <td className="py-2">{Number(item.price).toLocaleString()}</td>
                                                    <td className="py-2">{(Number(item.price) * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-gray-500 italic">Items details not available in this view.</p>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="btn btn-outline"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
