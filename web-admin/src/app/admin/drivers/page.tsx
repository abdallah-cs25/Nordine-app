'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

interface Driver {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    role: string;
    is_active: boolean;
    created_at: string;
    commission_rate: string;
    // placeholders for now
    deliveries?: number;
    rating?: number;
    earnings?: number;
}

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const data = await api.get('/users?role=DRIVER');
            // The API returns an array directly based on my check of users.js
            setDrivers(data || []);
        } catch (error) {
            console.error('Failed to fetch drivers', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (driver: Driver) => {
        if (!confirm(`Are you sure you want to ${driver.is_active ? 'suspend' : 'activate'} this driver?`)) return;
        try {
            await api.put(`/users/${driver.id}`, { is_active: !driver.is_active });
            fetchDrivers();
        } catch (error) {
            console.error('Failed to update driver status', error);
        }
    };

    const onlineCount = drivers.filter(d => d.is_active).length;

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Drivers Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage delivery drivers and their status</p>
                    </div>
                    <span className="badge badge-success text-sm py-1.5 px-3">
                        {onlineCount} Active Drivers
                    </span>
                </div>

                {/* Stats Cards - using basic info for now */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="card stat-card primary p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Drivers</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{drivers.length}</p>
                    </div>
                    <div className="card stat-card success p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Active Now</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{onlineCount}</p>
                    </div>
                    <div className="card stat-card accent p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Commission Rate</p>
                        <p className="text-2xl font-bold text-teal-600 mt-1">Standard 10%</p>
                    </div>
                </div>

                {loading ? (
                    <div className="card p-6"><div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-12 w-full" />)}</div></div>
                ) : (
                    <div className="table-container card">
                        <table>
                            <thead>
                                <tr>
                                    <th>Driver</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Commission</th>
                                    <th>Joined Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map((driver) => (
                                    <tr key={driver.id}>
                                        <td className="font-medium text-gray-900">{driver.name}</td>
                                        <td>{driver.email}</td>
                                        <td>{driver.phone_number}</td>
                                        <td>
                                            <span className={`badge ${driver.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                {driver.is_active ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td>{driver.commission_rate || '10'}%</td>
                                        <td className="text-gray-500">
                                            {new Date(driver.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex items-center space-x-2">
                                                <button className="text-sm text-teal-600 hover:text-teal-800 font-medium">Edit</button>
                                                <button
                                                    onClick={() => toggleStatus(driver)}
                                                    className={`text-sm font-medium ${driver.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                                >
                                                    {driver.is_active ? 'Suspend' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {drivers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="empty-state">🚗 No drivers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
