'use client';

import React from 'react';
import SellerLayout from '@/components/SellerLayout';

export default function SellerDashboard() {
    return (
        <SellerLayout>
            <div>
                <h1 className="text-2xl font-bold mb-6">Store Dashboard</h1>

                {/* Stats Cards - Seller Specific */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">New Orders</p>
                                <p className="text-3xl font-bold">12</p>
                                <p className="text-blue-500 text-sm">Need processing</p>
                            </div>
                            <span className="text-3xl">🔔</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Today's Sales</p>
                                <p className="text-3xl font-bold">15,000 DZD</p>
                            </div>
                            <span className="text-3xl">💰</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm">Products</p>
                                <p className="text-3xl font-bold">45</p>
                                <p className="text-green-500 text-sm">Active</p>
                            </div>
                            <span className="text-3xl">📦</span>
                        </div>
                    </div>
                </div>

                {/* Recent Store Orders */}
                <div className="bg-white rounded-xl shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-3">Order ID</th>
                                <th className="text-left p-3">Items</th>
                                <th className="text-left p-3">Total</th>
                                <th className="text-left p-3">Status</th>
                                <th className="text-left p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3">#1237</td>
                                <td className="p-3">2x Running Shoes</td>
                                <td className="p-3">12,000 DZD</td>
                                <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Pending</span></td>
                                <td className="p-3">
                                    <button className="text-sm bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700">View</button>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3">#1238</td>
                                <td className="p-3">1x Gym Bag</td>
                                <td className="p-3">4,500 DZD</td>
                                <td className="p-3"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Preparing</span></td>
                                <td className="p-3">
                                    <button className="text-sm bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700">View</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </SellerLayout>
    );
}
