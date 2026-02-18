'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    store: string;
    category: string;
    price: number;
    stock: number;
    status: string;
}

const mockProducts: Product[] = [
    { id: 1, name: 'Whey Protein 2kg', store: 'Gym Power', category: 'Gym', price: 8500, stock: 50, status: 'Active' },
    { id: 2, name: 'Dumbbells Set 20kg', store: 'Gym Power', category: 'Gym', price: 15000, stock: 20, status: 'Active' },
    { id: 3, name: 'Classic T-Shirt', store: 'Fashion Hub', category: 'Clothing', price: 1800, stock: 200, status: 'Active' },
    { id: 4, name: 'Oud Perfume 100ml', store: 'Perfume Palace', category: 'Perfumes', price: 12000, stock: 30, status: 'Active' },
    { id: 5, name: 'Wireless Earbuds', store: 'Tech World', category: 'Electronics', price: 6500, stock: 0, status: 'Out of Stock' },
];

export default function ProductsPage() {
    const [products] = useState<Product[]>(mockProducts);

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Products Management</h1>
                    <div className="flex space-x-2">
                        <select className="border rounded-lg px-4 py-2">
                            <option>All Categories</option>
                            <option>Gym</option>
                            <option>Clothing</option>
                            <option>Perfumes</option>
                            <option>Electronics</option>
                        </select>
                        <input type="text" placeholder="Search products..." className="border rounded-lg px-4 py-2 w-64" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Total Products</p>
                        <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">In Stock</p>
                        <p className="text-2xl font-bold text-green-600">{products.filter(p => p.stock > 0).length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Out of Stock</p>
                        <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock === 0).length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Total Value</p>
                        <p className="text-2xl font-bold text-teal-600">
                            {products.reduce((s, p) => s + (p.price * p.stock), 0).toLocaleString()} DZD
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4">Product</th>
                                <th className="text-left p-4">Store</th>
                                <th className="text-left p-4">Category</th>
                                <th className="text-left p-4">Price</th>
                                <th className="text-left p-4">Stock</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{product.name}</td>
                                    <td className="p-4">{product.store}</td>
                                    <td className="p-4">{product.category}</td>
                                    <td className="p-4 font-bold text-teal-600">{product.price.toLocaleString()} DZD</td>
                                    <td className="p-4">{product.stock}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-blue-500 hover:underline mr-2">Edit</button>
                                        <button className="text-red-500 hover:underline">Delete</button>
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
