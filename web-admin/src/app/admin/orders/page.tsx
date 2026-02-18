'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

interface Order {
    id: number;
    customer: string;
    store: string;
    amount: number;
    status: string;
    date: string;
}

const mockOrders: Order[] = [
    { id: 1234, customer: 'Ahmed M.', store: 'Gym Power', amount: 2500, status: 'Delivered', date: '2026-01-30' },
    { id: 1235, customer: 'Fatima B.', store: 'Fashion Hub', amount: 8000, status: 'In Transit', date: '2026-01-30' },
    { id: 1236, customer: 'Omar K.', store: 'Tech World', amount: 15000, status: 'Preparing', date: '2026-01-30' },
    { id: 1237, customer: 'Sara A.', store: 'Perfume Palace', amount: 3500, status: 'Pending', date: '2026-01-29' },
];

export default function OrdersPage() {
    const [orders] = useState<Order[]>(mockOrders);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'In Transit': return 'bg-blue-100 text-blue-700';
            case 'Preparing': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Orders Management</h1>
                    <div className="flex space-x-2">
                        <select className="border rounded-lg px-4 py-2">
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Preparing</option>
                            <option>In Transit</option>
                            <option>Delivered</option>
                        </select>
                        <input type="date" className="border rounded-lg px-4 py-2" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4">Order ID</th>
                                <th className="text-left p-4">Customer</th>
                                <th className="text-left p-4">Store</th>
                                <th className="text-left p-4">Amount</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Date</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">#{order.id}</td>
                                    <td className="p-4">{order.customer}</td>
                                    <td className="p-4">{order.store}</td>
                                    <td className="p-4">{order.amount.toLocaleString()} DZD</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{order.date}</td>
                                    <td className="p-4">
                                        <button className="text-blue-500 hover:underline mr-2">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
