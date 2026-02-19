'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

interface Product {
    id: number;
    name: string;
    store_id: number;
    store_name?: string; // from join
    category: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    is_active: boolean;
    created_at: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product', error);
            alert('Failed to delete product');
        }
    };

    const toggleStatus = async (product: Product) => {
        if (!confirm(`Are you sure you want to ${product.is_active ? 'deactivate' : 'activate'} this product?`)) return;
        try {
            await api.put(`/products/${product.id}`, { is_active: !product.is_active });
            fetchProducts();
        } catch (error) {
            console.error('Failed to update product', error);
        }
    };

    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.store_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <AdminLayout>
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Browse and manage all marketplace products</p>
                    </div>
                    <div className="flex space-x-2">
                        <select
                            className="form-input w-auto"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="form-input w-48 sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="card stat-card primary p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
                    </div>
                    <div className="card stat-card success p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">In Stock</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{products.filter(p => p.stock > 0).length}</p>
                    </div>
                    <div className="card stat-card danger p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Out of Stock</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{products.filter(p => p.stock === 0).length}</p>
                    </div>
                    <div className="card stat-card accent p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Value</p>
                        <p className="text-2xl font-bold text-teal-600 mt-1">
                            {products.reduce((s, p) => s + (Number(p.price) * Number(p.stock)), 0).toLocaleString()} DZD
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="card p-6"><div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-12 w-full" />)}</div></div>
                ) : (
                    <div className="table-container card">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Store</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="font-medium text-gray-900 flex items-center">
                                            {product.images?.[0] && (
                                                <img src={product.images[0]} alt={product.name} className="w-8 h-8 rounded object-cover mr-2" />
                                            )}
                                            {product.name}
                                        </td>
                                        <td className="text-gray-600">{product.store_name || product.store_id}</td>
                                        <td><span className="badge badge-neutral">{product.category}</span></td>
                                        <td className="font-semibold text-teal-600">{Number(product.price).toLocaleString()} DZD</td>
                                        <td>
                                            <span className={product.stock < 10 ? 'text-red-500 font-bold' : ''}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${product.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => toggleStatus(product)}
                                                    className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                                                >
                                                    {product.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="empty-state">📦 No products found matching your filters.</td>
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
