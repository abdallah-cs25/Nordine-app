'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

interface Coupon {
    id: number;
    code: string;
    description: string;
    discount_type: string;
    discount_value: number;
    min_order: number;
    usage: string;
    status: string;
    expires: string;
}

const mockCoupons: Coupon[] = [
    { id: 1, code: 'WELCOME50', description: '50% off first order', discount_type: 'PERCENTAGE', discount_value: 50, min_order: 2000, usage: '234/1000', status: 'Active', expires: '2026-12-31' },
    { id: 2, code: 'SAVE500', description: '500 DZD off', discount_type: 'FIXED', discount_value: 500, min_order: 3000, usage: '189/500', status: 'Active', expires: '2026-06-30' },
    { id: 3, code: 'DELIVERY10', description: '10% off delivery', discount_type: 'PERCENTAGE', discount_value: 10, min_order: 1500, usage: '567/∞', status: 'Active', expires: 'Never' },
    { id: 4, code: 'SUMMER2026', description: 'Summer Sale 25%', discount_type: 'PERCENTAGE', discount_value: 25, min_order: 5000, usage: '45/200', status: 'Active', expires: '2026-08-31' },
    { id: 5, code: 'OLD2025', description: 'Old expired coupon', discount_type: 'FIXED', discount_value: 200, min_order: 1000, usage: '100/100', status: 'Expired', expires: '2025-12-31' },
];

export default function CouponsPage() {
    const [coupons] = useState<Coupon[]>(mockCoupons);
    const [showModal, setShowModal] = useState(false);

    const activeCoupons = coupons.filter(c => c.status === 'Active').length;

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Coupons & Discounts</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                    >
                        + Create Coupon
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Total Coupons</p>
                        <p className="text-2xl font-bold">{coupons.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Active</p>
                        <p className="text-2xl font-bold text-green-600">{activeCoupons}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Total Usage</p>
                        <p className="text-2xl font-bold text-blue-600">1,135</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Total Savings</p>
                        <p className="text-2xl font-bold text-teal-600">567,500 DZD</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4">Code</th>
                                <th className="text-left p-4">Description</th>
                                <th className="text-left p-4">Discount</th>
                                <th className="text-left p-4">Min Order</th>
                                <th className="text-left p-4">Usage</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Expires</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <code className="bg-gray-100 px-2 py-1 rounded font-mono font-bold">
                                            {coupon.code}
                                        </code>
                                    </td>
                                    <td className="p-4">{coupon.description}</td>
                                    <td className="p-4 font-bold text-teal-600">
                                        {coupon.discount_type === 'PERCENTAGE'
                                            ? `${coupon.discount_value}%`
                                            : `${coupon.discount_value} DZD`}
                                    </td>
                                    <td className="p-4">{coupon.min_order.toLocaleString()} DZD</td>
                                    <td className="p-4">{coupon.usage}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm ${coupon.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {coupon.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{coupon.expires}</td>
                                    <td className="p-4">
                                        <button className="text-blue-500 hover:underline mr-2">Edit</button>
                                        <button className="text-red-500 hover:underline">
                                            {coupon.status === 'Active' ? 'Disable' : 'Enable'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>
                            <div className="space-y-4">
                                <input type="text" placeholder="Coupon Code" className="w-full border rounded-lg px-4 py-2" />
                                <input type="text" placeholder="Description" className="w-full border rounded-lg px-4 py-2" />
                                <div className="grid grid-cols-2 gap-4">
                                    <select className="border rounded-lg px-4 py-2">
                                        <option>Percentage</option>
                                        <option>Fixed Amount</option>
                                    </select>
                                    <input type="number" placeholder="Value" className="border rounded-lg px-4 py-2" />
                                </div>
                                <input type="number" placeholder="Minimum Order (DZD)" className="w-full border rounded-lg px-4 py-2" />
                                <input type="date" className="w-full border rounded-lg px-4 py-2" />
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg">Create</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
