'use client';

import React, { useState } from 'react';
import SellerLayout from '@/components/SellerLayout';

export default function ProductManagement() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Running Shoes', price: 6000, category: 'Clothing', stock: 15, image: 'shoes.jpg' },
        { id: 2, name: 'Gym T-Shirt', price: 2500, category: 'Clothing', stock: 50, image: 'tshirt.jpg' },
    ]);
    const [showForm, setShowForm] = useState(false);

    return (
        <SellerLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Product Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    {showForm ? 'Cancel' : '+ Add Product'}
                </button>
            </div>

            {/* Add Product Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-8 border border-indigo-100">
                    <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input type="text" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Nike Air Max" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (DZD)</label>
                            <input type="number" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500">
                                <option>Clothing</option>
                                <option>Electronics</option>
                                <option>Food</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                            <input type="number" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500" placeholder="0" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500" rows={3} placeholder="Product details..."></textarea>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer">
                                <p className="text-gray-500">Click to upload images</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                            Save Product
                        </button>
                    </div>
                </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{product.price} DZD</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{product.stock} units</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </SellerLayout>
    );
}
