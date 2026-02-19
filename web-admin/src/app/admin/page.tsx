'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/utils/api';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.get('/analytics/dashboard?period=month');
                setStats(data);
            } catch (err) {
                console.error('Failed to load admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Orders', value: stats?.orders?.total || 0, sub: 'All time', icon: '🛒', color: 'primary' },
        { label: 'Total Revenue', value: `${(stats?.orders?.revenue || 0).toLocaleString()} DZD`, sub: 'Gross Sales', icon: '💰', color: 'success' },
        { label: 'Active Stores', value: stats?.stores?.active || 0, sub: 'Platform Wide', icon: '🏪', color: 'accent' },
        { label: 'Active Drivers', value: stats?.drivers?.active || 0, sub: 'On Duty', icon: '🚗', color: 'warning' },
    ];

    return (
        <AdminLayout>
            <div>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back — here's what's happening today</p>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="card p-6">
                                <div className="skeleton h-3 w-24 mb-3" />
                                <div className="skeleton h-8 w-20 mb-2" />
                                <div className="skeleton h-3 w-16" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((card, i) => (
                            <div key={i} className={`card stat-card ${card.color} p-6`} style={{ animationDelay: `${i * 80}ms` }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{card.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                                        <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                                    </div>
                                    <span className="text-2xl opacity-80">{card.icon}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recent Activity */}
                <div className="card p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                        <Link href="/admin/orders" className="text-sm font-medium text-teal-600 hover:text-teal-500 transition-colors">
                            View All Orders →
                        </Link>
                    </div>
                    <div className="empty-state py-6">
                        <p className="text-sm">
                            Check the <Link href="/admin/orders" className="text-teal-600 font-medium hover:underline">Orders</Link> page for latest activity.
                        </p>
                    </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Commission Summary */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Summary</h2>
                        <div className="space-y-3">
                            {[
                                { label: 'Total Generated', value: `${(stats?.commissions?.total || 0).toLocaleString()} DZD`, color: 'text-teal-600' },
                                { label: 'Collected', value: `${(stats?.commissions?.collected || 0).toLocaleString()} DZD`, color: 'text-green-600' },
                                { label: 'Pending Collection', value: `${(stats?.commissions?.pending || 0).toLocaleString()} DZD`, color: 'text-amber-600' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <span className="text-sm text-gray-600">{item.label}</span>
                                    <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">New Users (This Month)</span>
                                <span className="text-sm font-semibold text-gray-900">{stats?.users?.new || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Total Products</span>
                                <span className="text-sm font-semibold text-gray-900">{stats?.products?.total || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-600">Total Stores</span>
                                <span className="text-sm font-semibold text-gray-900">{stats?.stores?.total || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
