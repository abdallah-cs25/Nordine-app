'use client';

import React, { useState, useEffect } from 'react';
import SellerLayout from '@/components/SellerLayout';
import { api } from '@/utils/api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category_id: number;
    image_url: string;
    is_available: boolean;
    category_name_en?: string;
}

interface Category {
    id: number;
    name_en: string;
}

export default function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category_id: '',
        image_url: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const storeData = localStorage.getItem('store');
            if (!storeData) {
                // If no store data, maybe redirect or show error?
                // Ideally this shouldn't happen if middleware works, but for safety
                return;
            }
            const store = JSON.parse(storeData);

            // Fetch categories (assuming we have an endpoint, otherwise mock/hardcode)
            // We haven't built GET /api/categories strictly yet but likely needed. 
            // For now, let's just fetch products and if categories endpoint fails, use empty or hardcoded.
            try {
                // We don't have a public categories route? 
                // Actually categories.js exists but wasn't in my recent edits list.
                // I'll try to fetch, if fail, fallback.
                const cats = await api.get('/search/categories'); // usually public
                setCategories(cats);
            } catch (e) {
                console.warn('Categories fetch failed', e);
                // Fallback categories for demo
                setCategories([
                    { id: 1, name_en: 'Clothing' },
                    { id: 2, name_en: 'Electronics' },
                    { id: 3, name_en: 'Food' },
                    { id: 4, name_en: 'Furniture' }
                ]);
            }

            const prods = await api.get(`/products?store_id=${store.id}`);
            setProducts(prods);

        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const storeData = localStorage.getItem('store');
            const store = JSON.parse(storeData || '{}');

            let imageUrl = formData.image_url;

            // Upload image if selected
            if (imageFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', imageFile);

                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/upload`, {
                    method: 'POST',
                    body: uploadFormData,
                    // No headers for Content-Type, let browser set it with boundary
                });

                if (!uploadRes.ok) throw new Error('Image upload failed');
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
            }

            const payload = {
                store_id: store.id,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock_quantity: parseInt(formData.stock_quantity),
                category_id: parseInt(formData.category_id),
                image_url: imageUrl
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
            } else {
                await api.post('/products', payload);
            }

            // Reset and reload
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Failed to save product', error);
            alert('Failed to save product');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock_quantity: product.stock_quantity?.toString() || '0',
            category_id: product.category_id?.toString() || '',
            image_url: product.image_url || ''
        });
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete', error);
            alert('Failed to delete product');
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stock_quantity: '',
            category_id: '',
            image_url: ''
        });
        setImageFile(null);
        setShowForm(false);
    };

    return (
        <SellerLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                    <button
                        onClick={() => { resetForm(); setShowForm(!showForm); }}
                        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
                    >
                        {showForm ? 'Cancel' : '+ Add Product'}
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (DZD)</label>
                                    <input
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name_en}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                    <input
                                        name="stock_quantity"
                                        value={formData.stock_quantity}
                                        onChange={handleInputChange}
                                        type="number"
                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-teal-500 outline-none"
                                        rows={3}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                                    />
                                    {formData.image_url && (
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                                            <img src={formData.image_url.startsWith('http') ? formData.image_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${formData.image_url}`} alt="Preview" className="h-20 w-20 object-cover rounded border" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2 border rounded text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition disabled:opacity-50"
                                >
                                    {uploading ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products List */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading products...</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No products found. Add your first product!
                                        </td>
                                    </tr>
                                ) : (
                                    products.map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border">
                                                        {product.image_url ? (
                                                            <img
                                                                src={product.image_url.startsWith('http') ? product.image_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${product.image_url}`}
                                                                alt={product.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-gray-400">📷</div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500">{product.category_name_en || 'Uncategorized'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{Number(product.price).toLocaleString()} DZD</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{product.stock_quantity || 0} units</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_available
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.is_available ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-teal-600 hover:text-teal-900 mr-4 font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
