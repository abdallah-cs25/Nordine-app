'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

export default function AnalyticsPage() {
    const [period, setPeriod] = useState('month');
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await api.get(`/analytics/dashboard?period=${period}`);
                setStats(data);
            } catch (err) {
                console.error('Failed to load analytics', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [period]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="space-y-4">
                    <div className="skeleton h-8 w-48" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-28 w-full" />)}</div>
                    <div className="skeleton h-48 w-full" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-1">Key metrics and platform insights</p>
                    </div>
                    <select
                        className="form-input w-auto"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow p-6 text-white">
                        <p className="text-sm opacity-80">Total Revenue</p>
                        <p className="text-3xl font-bold">{(stats?.orders?.revenue || 0).toLocaleString()} DZD</p>
                        <p className="text-sm mt-2">Gross Sales</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
                        <p className="text-sm opacity-80">Total Orders</p>
                        <p className="text-3xl font-bold">{stats?.orders?.total || 0}</p>
                        <p className="text-sm mt-2">Volume</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow p-6 text-white">
                        <p className="text-sm opacity-80">New Users</p>
                        <p className="text-3xl font-bold">{stats?.users?.new || 0}</p>
                        <p className="text-sm mt-2">Growth</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow p-6 text-white">
                        <p className="text-sm opacity-80">Avg Order Value</p>
                        {/* Simple calculation, careful with division by zero */}
                        <p className="text-3xl font-bold">
                            {stats?.orders?.total > 0
                                ? Math.round(stats.orders.revenue / stats.orders.total).toLocaleString()
                                : 0} DZD
                        </p>
                        <p className="text-sm mt-2">Estimate</p>
                    </div>
                </div>

                {/* Charts Section - Placeholder for now as we need historical data endpoints */}
                {/* We can restore the Mock Charts if we want visual filler, or just showing the Status Breakdown for now */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Orders by Status */}
                    <div className="card p-6 lg:col-span-2">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Orders Breakdown</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                            {['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(status => {
                                const count = stats?.orders?.by_status?.find((s: any) => s.status === status)?.count || 0;
                                return (
                                    <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                                        <p className="text-xl font-bold text-gray-800">{count}</p>
                                        <p className="text-xs text-gray-500 mt-1 capitalize">{status.replace(/_/g, ' ').toLowerCase()}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Platform Stats</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span>Active Stores</span>
                                <span className="font-bold">{stats?.stores?.active || 0}</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span>Active Drivers</span>
                                <span className="font-bold">{stats?.drivers?.active || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Commissions</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span>Total Commissions</span>
                                <span className="font-bold text-teal-600">{(stats?.commissions?.total || 0).toLocaleString()} DZD</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span>Collected</span>
                                <span className="font-bold text-green-600">{(stats?.commissions?.collected || 0).toLocaleString()} DZD</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span>Pending</span>
                                <span className="font-bold text-red-600">{(stats?.commissions?.pending || 0).toLocaleString()} DZD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
