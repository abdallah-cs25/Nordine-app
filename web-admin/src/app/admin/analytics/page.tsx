'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

export default function AnalyticsPage() {
    const [period, setPeriod] = useState('month');

    // Mock data
    const stats = {
        revenue: 2450000,
        orders: 342,
        customers: 156,
        avgOrderValue: 7164
    };

    const topStores = [
        { name: 'Gym Power', orders: 89, revenue: 756000 },
        { name: 'Fashion Hub', orders: 67, revenue: 401000 },
        { name: 'Perfume Palace', orders: 54, revenue: 648000 },
        { name: 'Tech World', orders: 45, revenue: 427500 },
    ];

    const recentDays = [
        { date: '25 Jan', orders: 12, revenue: 86400 },
        { date: '26 Jan', orders: 18, revenue: 129600 },
        { date: '27 Jan', orders: 15, revenue: 107500 },
        { date: '28 Jan', orders: 22, revenue: 158400 },
        { date: '29 Jan', orders: 19, revenue: 136800 },
        { date: '30 Jan', orders: 25, revenue: 180000 },
    ];

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                    <select
                        className="border rounded-lg px-4 py-2"
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow p-6 text-white">
                        <p className="text-sm opacity-80">Total Revenue</p>
                        <p className="text-3xl font-bold">{stats.revenue.toLocaleString()} DZD</p>
                        <p className="text-sm mt-2">+12% from last period</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
                        <p className="text-sm opacity-80">Total Orders</p>
                        <p className="text-3xl font-bold">{stats.orders}</p>
                        <p className="text-sm mt-2">+8% from last period</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow p-6 text-white">
                        <p className="text-sm opacity-80">New Customers</p>
                        <p className="text-3xl font-bold">{stats.customers}</p>
                        <p className="text-sm mt-2">+15% from last period</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow p-6 text-white">
                        <p className="text-sm opacity-80">Avg Order Value</p>
                        <p className="text-3xl font-bold">{stats.avgOrderValue.toLocaleString()} DZD</p>
                        <p className="text-sm mt-2">+3% from last period</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Revenue Trend</h2>
                        <div className="space-y-4">
                            {recentDays.map((day) => (
                                <div key={day.date} className="flex items-center">
                                    <span className="w-16 text-sm text-gray-500">{day.date}</span>
                                    <div className="flex-1 mx-4">
                                        <div className="bg-gray-100 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="bg-teal-500 h-full rounded-full"
                                                style={{ width: `${(day.revenue / 200000) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="w-24 text-right text-sm font-medium">
                                        {(day.revenue / 1000).toFixed(0)}K DZD
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Stores */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-lg font-bold mb-4">Top Performing Stores</h2>
                        <div className="space-y-4">
                            {topStores.map((store, index) => (
                                <div key={store.name} className="flex items-center">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' :
                                            index === 1 ? 'bg-gray-400' :
                                                index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <div className="ml-4 flex-1">
                                        <p className="font-medium">{store.name}</p>
                                        <p className="text-sm text-gray-500">{store.orders} orders</p>
                                    </div>
                                    <span className="font-bold text-teal-600">
                                        {(store.revenue / 1000).toFixed(0)}K DZD
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders by Status */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-lg font-bold mb-4">Orders by Status</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">23</p>
                            <p className="text-sm text-gray-500">Pending</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">15</p>
                            <p className="text-sm text-gray-500">Preparing</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">8</p>
                            <p className="text-sm text-gray-500">In Transit</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">289</p>
                            <p className="text-sm text-gray-500">Delivered</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <p className="text-2xl font-bold text-red-600">7</p>
                            <p className="text-sm text-gray-500">Cancelled</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
