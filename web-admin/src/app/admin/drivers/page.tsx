'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

interface Driver {
    id: number;
    name: string;
    phone: string;
    status: string;
    deliveries: number;
    rating: number;
    earnings: number;
}

const mockDrivers: Driver[] = [
    { id: 1, name: 'Omar Benali', phone: '+213555000004', status: 'Online', deliveries: 156, rating: 4.9, earnings: 45000 },
    { id: 2, name: 'Karim Saidi', phone: '+213555000010', status: 'Offline', deliveries: 89, rating: 4.7, earnings: 28000 },
    { id: 3, name: 'Youcef Hadj', phone: '+213555000015', status: 'On Delivery', deliveries: 234, rating: 4.8, earnings: 67000 },
    { id: 4, name: 'Rachid Amrani', phone: '+213555000020', status: 'Online', deliveries: 45, rating: 4.5, earnings: 12000 },
];

export default function DriversPage() {
    const [drivers] = useState<Driver[]>(mockDrivers);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Online': return 'bg-green-100 text-green-700';
            case 'On Delivery': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const onlineCount = drivers.filter(d => d.status === 'Online' || d.status === 'On Delivery').length;

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Drivers Management</h1>
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                        {onlineCount} Online Now
                    </span>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Total Drivers</p>
                        <p className="text-2xl font-bold">{drivers.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Online Now</p>
                        <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Total Deliveries</p>
                        <p className="text-2xl font-bold">{drivers.reduce((s, d) => s + d.deliveries, 0)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Total Earnings</p>
                        <p className="text-2xl font-bold text-teal-600">{drivers.reduce((s, d) => s + d.earnings, 0).toLocaleString()} DZD</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4">Driver</th>
                                <th className="text-left p-4">Phone</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Deliveries</th>
                                <th className="text-left p-4">Rating</th>
                                <th className="text-left p-4">Earnings</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((driver) => (
                                <tr key={driver.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{driver.name}</td>
                                    <td className="p-4">{driver.phone}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(driver.status)}`}>
                                            {driver.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{driver.deliveries}</td>
                                    <td className="p-4">
                                        <span className="flex items-center">
                                            ⭐ {driver.rating}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-teal-600">{driver.earnings.toLocaleString()} DZD</td>
                                    <td className="p-4">
                                        <button className="text-blue-500 hover:underline mr-2">View</button>
                                        <button className="text-red-500 hover:underline">Suspend</button>
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
