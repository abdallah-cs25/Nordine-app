'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

interface Commission {
    id: number;
    orderId: number;
    store: string;
    amount: number;
    rate: number;
    status: string;
    date: string;
}

const mockCommissions: Commission[] = [
    { id: 1, orderId: 1234, store: 'Gym Power', amount: 250, rate: 10, status: 'Collected', date: '2026-01-30' },
    { id: 2, orderId: 1235, store: 'Fashion Hub', amount: 800, rate: 10, status: 'Pending', date: '2026-01-30' },
    { id: 3, orderId: 1236, store: 'Tech World', amount: 1500, rate: 10, status: 'Pending', date: '2026-01-30' },
];

export default function CommissionsPage() {
    const [commissions] = useState<Commission[]>(mockCommissions);

    const totalPending = commissions.filter(c => c.status === 'Pending').reduce((sum, c) => sum + c.amount, 0);
    const totalCollected = commissions.filter(c => c.status === 'Collected').reduce((sum, c) => sum + c.amount, 0);

    return (
        <AdminLayout>
            <div>
                <h1 className="text-2xl font-bold mb-6">Commission Management</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500">Pending Commission</p>
                        <p className="text-3xl font-bold text-yellow-600">{totalPending.toLocaleString()} DZD</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500">Collected Commission</p>
                        <p className="text-3xl font-bold text-green-600">{totalCollected.toLocaleString()} DZD</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6">
                        <p className="text-gray-500">Commission Rate</p>
                        <p className="text-3xl font-bold text-teal-600">10%</p>
                        <button className="text-blue-500 text-sm hover:underline mt-2">Change Rate</button>
                    </div>
                </div>

                {/* Commission Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4">Order ID</th>
                                <th className="text-left p-4">Store</th>
                                <th className="text-left p-4">Rate</th>
                                <th className="text-left p-4">Amount</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Date</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commissions.map((commission) => (
                                <tr key={commission.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">#{commission.orderId}</td>
                                    <td className="p-4">{commission.store}</td>
                                    <td className="p-4">{commission.rate}%</td>
                                    <td className="p-4 font-bold text-teal-600">{commission.amount.toLocaleString()} DZD</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm ${commission.status === 'Collected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {commission.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{commission.date}</td>
                                    <td className="p-4">
                                        {commission.status === 'Pending' && (
                                            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                                                Mark Collected
                                            </button>
                                        )}
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
