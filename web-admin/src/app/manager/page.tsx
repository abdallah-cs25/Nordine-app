'use client';

import React, { useState } from 'react';

// Store Manager Layout - simplified version for order processing and inventory
export default function ManagerDashboard() {
    const [activeTab, setActiveTab] = useState('orders');

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-indigo-600 text-white p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">Store Manager</h1>
                        <p className="text-indigo-200 text-sm">Fashion Hub - Order Processing</p>
                    </div>
                    <button className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-400">
                        Logout
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto mt-6 px-4">
                <div className="flex space-x-4 border-b border-gray-200">
                    {['orders', 'inventory', 'ready'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-4 font-medium capitalize ${activeTab === tab
                                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'ready' ? 'Ready for Pickup' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto mt-6 px-4 pb-8">
                {activeTab === 'orders' && <PendingOrders />}
                {activeTab === 'inventory' && <InventoryManagement />}
                {activeTab === 'ready' && <ReadyForPickup />}
            </main>
        </div>
    );
}

// Pending Orders Component
function PendingOrders() {
    const orders = [
        { id: 101, customer: 'Ahmed Benali', items: 3, total: 8500, time: '10 min ago', status: 'PENDING' },
        { id: 102, customer: 'Sara Mansouri', items: 1, total: 2500, time: '15 min ago', status: 'PENDING' },
        { id: 103, customer: 'Karim Cherif', items: 5, total: 15000, time: '25 min ago', status: 'PREPARING' },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Pending Orders ({orders.filter(o => o.status === 'PENDING').length})</h2>
            {orders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                    <div>
                        <p className="font-bold">Order #{order.id}</p>
                        <p className="text-gray-600">{order.customer} • {order.items} items</p>
                        <p className="text-sm text-gray-400">{order.time}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg">{order.total} DZD</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {order.status === 'PENDING' && (
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Accept
                            </button>
                        )}
                        {order.status === 'PREPARING' && (
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                                Mark Ready
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Inventory Management Component
function InventoryManagement() {
    const products = [
        { id: 1, name: 'Sports T-Shirt', stock: 45, lowStock: false },
        { id: 2, name: 'Running Shoes', stock: 3, lowStock: true },
        { id: 3, name: 'Yoga Mat', stock: 22, lowStock: false },
        { id: 4, name: 'Protein Whey', stock: 0, lowStock: true },
    ];

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Inventory Status</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-4 py-3">{product.name}</td>
                                <td className="px-4 py-3">{product.stock}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock === 0
                                            ? 'bg-red-100 text-red-800'
                                            : product.lowStock
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                        {product.stock === 0 ? 'Out of Stock' : product.lowStock ? 'Low Stock' : 'In Stock'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="text-indigo-600 hover:text-indigo-800">Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Ready for Pickup Component
function ReadyForPickup() {
    const readyOrders = [
        { id: 100, driver: 'Omar Benali', phone: '+213 555 000 004', eta: '5 min' },
    ];

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Ready for Pickup ({readyOrders.length})</h2>
            {readyOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    No orders ready for pickup
                </div>
            ) : (
                <div className="space-y-4">
                    {readyOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">Order #{order.id}</p>
                                    <p className="text-gray-600">Driver: {order.driver}</p>
                                    <p className="text-sm text-gray-400">{order.phone}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-600 font-bold">Driver arriving in {order.eta}</p>
                                    <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                        Hand Over
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
