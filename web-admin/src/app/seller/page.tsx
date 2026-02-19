'use client';

import React, { useEffect, useState } from 'react';
import SellerLayout from '@/components/SellerLayout';
import { api } from '@/utils/api';
import Link from 'next/link';

export default function SellerDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.get('/analytics/dashboard?period=month'); // Default to this month
                setStats(data);
            } catch (err) {
                console.error('Failed to load stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <SellerLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>
                    <span className="text-sm text-gray-500">Overview for This Month</span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Total Revenue */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                        {stats?.orders?.revenue?.toLocaleString() || 0} DZD
                                    </h3>
                                </div>
                                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                    💰
                                </div>
                            </div>
                        </div>

                        {/* Total Orders */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                        {stats?.orders?.total || 0}
                                    </h3>
                                </div>
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    📦
                                </div>
                            </div>
                        </div>

                        {/* Pending Orders (Derived from status) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                        {stats?.orders?.by_status?.find((s: any) => s.status === 'PENDING')?.count || 0}
                                    </h3>
                                </div>
                                <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                                    ⏳
                                </div>
                            </div>
                        </div>

                        {/* Commission Due */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Commission Due</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                        {stats?.commissions?.pending?.toLocaleString() || 0} DZD
                                    </h3>
                                </div>
                                <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                    🧾
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Activity Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                        <Link href="/seller/orders" className="text-teal-600 hover:text-teal-700 font-medium text-sm">
                            View All
                        </Link>
                    </div>

                    <div className="text-center py-8 text-gray-500">
                        <p>Go to <Link href="/seller/orders" className="text-teal-600 hover:underline">Orders Page</Link> to view detailed list.</p>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
