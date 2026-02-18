'use client';

import AdminLayout from '@/components/AdminLayout';

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <div>
                <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Total Orders</p>
                                <p className="text-3xl font-bold">1,234</p>
                                <p className="text-green-500 text-sm">+12% from last month</p>
                            </div>
                            <span className="text-3xl">🛒</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Total Revenue</p>
                                <p className="text-3xl font-bold">450,000 DZD</p>
                                <p className="text-green-500 text-sm">+8% from last month</p>
                            </div>
                            <span className="text-3xl">💰</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Active Stores</p>
                                <p className="text-3xl font-bold">56</p>
                                <p className="text-blue-500 text-sm">3 pending approval</p>
                            </div>
                            <span className="text-3xl">🏪</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Active Drivers</p>
                                <p className="text-3xl font-bold">28</p>
                                <p className="text-green-500 text-sm">18 online now</p>
                            </div>
                            <span className="text-3xl">🚗</span>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-3">Order ID</th>
                                <th className="text-left p-3">Customer</th>
                                <th className="text-left p-3">Store</th>
                                <th className="text-left p-3">Amount</th>
                                <th className="text-left p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3">#1234</td>
                                <td className="p-3">Ahmed M.</td>
                                <td className="p-3">Gym Power</td>
                                <td className="p-3">2,500 DZD</td>
                                <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">Delivered</span></td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3">#1235</td>
                                <td className="p-3">Fatima B.</td>
                                <td className="p-3">Fashion Hub</td>
                                <td className="p-3">8,000 DZD</td>
                                <td className="p-3"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">In Transit</span></td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3">#1236</td>
                                <td className="p-3">Omar K.</td>
                                <td className="p-3">Tech World</td>
                                <td className="p-3">15,000 DZD</td>
                                <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Preparing</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Commission Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Commission Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span>Today</span>
                                <span className="font-bold text-teal-600">4,500 DZD</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>This Week</span>
                                <span className="font-bold text-teal-600">28,000 DZD</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>This Month</span>
                                <span className="font-bold text-teal-600">120,000 DZD</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Top Stores</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span>Gym Power</span>
                                <span className="font-bold">89 orders</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Fashion Hub</span>
                                <span className="font-bold">76 orders</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Tech World</span>
                                <span className="font-bold">54 orders</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
