'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

interface Coupon {
    id: number;
    code: string;
    description: string;
    discount_type: string;
    discount_value: number;
    min_order_amount: number;
    usage_limit?: number;
    usage_count: number;
    is_active: boolean;
    expires_at?: string;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // New Coupon State
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount_type: 'PERCENTAGE',
        discount_value: 0,
        min_order_amount: 0,
        usage_limit: 0,
        expires_at: ''
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await api.get('/coupons/all');
            setCoupons(data);
        } catch (error) {
            console.error('Failed to fetch coupons', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/coupons', newCoupon);
            setShowModal(false);
            fetchCoupons();
            // Reset form
            setNewCoupon({
                code: '',
                description: '',
                discount_type: 'PERCENTAGE',
                discount_value: 0,
                min_order_amount: 0,
                usage_limit: 0,
                expires_at: ''
            });
        } catch (error) {
            console.error('Failed to create coupon', error);
            alert('Failed to create coupon');
        }
    };

    const toggleStatus = async (coupon: Coupon) => {
        try {
            await api.put(`/coupons/${coupon.id}`, { is_active: !coupon.is_active });
            fetchCoupons();
        } catch (error) {
            console.error('Failed to update coupon status', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            setCoupons(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete coupon', error);
        }
    };

    const activeCoupons = coupons.filter(c => c.is_active).length;

    return (
        <AdminLayout>
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Coupons & Discounts</h1>
                        <p className="text-sm text-gray-500 mt-1">Create and manage promotional coupons</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary"
                    >
                        + Create Coupon
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="card stat-card primary p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Coupons</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{coupons.length}</p>
                    </div>
                    <div className="card stat-card success p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Active</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{activeCoupons}</p>
                    </div>
                    <div className="card stat-card info p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Usage</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{coupons.reduce((s, c) => s + c.usage_count, 0)}</p>
                    </div>
                    <div className="card stat-card accent p-4">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Savings</p>
                        <p className="text-2xl font-bold text-teal-600 mt-1">-- DZD</p>
                    </div>
                </div>

                {loading ? (
                    <div className="card p-6"><div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-12 w-full" />)}</div></div>
                ) : (
                    <div className="table-container card">
                        <table>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Description</th>
                                    <th>Discount</th>
                                    <th>Min Order</th>
                                    <th>Usage</th>
                                    <th>Status</th>
                                    <th>Expires</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td>
                                            <code className="bg-gray-100 px-2 py-1 rounded font-mono font-bold text-sm">
                                                {coupon.code}
                                            </code>
                                        </td>
                                        <td>{coupon.description}</td>
                                        <td className="font-semibold text-teal-600">
                                            {coupon.discount_type === 'PERCENTAGE'
                                                ? `${coupon.discount_value}%`
                                                : `${Number(coupon.discount_value).toLocaleString()} DZD`}
                                        </td>
                                        <td>{Number(coupon.min_order_amount).toLocaleString()} DZD</td>
                                        <td>{coupon.usage_count} / {coupon.usage_limit || '∞'}</td>
                                        <td>
                                            <span className={`badge ${coupon.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                {coupon.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="text-gray-500">
                                            {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => toggleStatus(coupon)}
                                                    className={`text-sm font-medium ${coupon.is_active ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'}`}
                                                >
                                                    {coupon.is_active ? 'Disable' : 'Enable'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {coupons.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="empty-state">🎟️ No coupons found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Create Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Coupon</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    className="form-input"
                                    value={newCoupon.code}
                                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    className="form-input"
                                    value={newCoupon.description}
                                    onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        className="form-input"
                                        value={newCoupon.discount_type}
                                        onChange={e => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                                    >
                                        <option value="PERCENTAGE">Percentage</option>
                                        <option value="FIXED">Fixed Amount</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Value"
                                        className="form-input"
                                        value={newCoupon.discount_value}
                                        onChange={e => setNewCoupon({ ...newCoupon, discount_value: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <input
                                    type="number"
                                    placeholder="Minimum Order (DZD)"
                                    className="form-input"
                                    value={newCoupon.min_order_amount}
                                    onChange={e => setNewCoupon({ ...newCoupon, min_order_amount: parseFloat(e.target.value) })}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Usage Limit (0 for unlimited)"
                                        className="form-input"
                                        value={newCoupon.usage_limit}
                                        onChange={e => setNewCoupon({ ...newCoupon, usage_limit: parseInt(e.target.value) })}
                                    />
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={newCoupon.expires_at}
                                        onChange={e => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                                <button onClick={handleCreate} className="btn btn-primary">Create</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
