'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

interface Commission {
    id: number;
    order_id: number;
    store_id: number;
    store_name?: string; // from join
    amount: number;
    rate: number;
    status: string;
    created_at: string;
    order_total?: number;
}

interface Stats {
    count: number;
    total_amount: number;
    pending_amount: number;
    paid_amount: number;
}

export default function CommissionsPage() {
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [stats, setStats] = useState<Stats>({ count: 0, total_amount: 0, pending_amount: 0, paid_amount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [commissionsData, statsData] = await Promise.all([
                api.get('/commissions'),
                api.get('/commissions/stats')
            ]);
            setCommissions(commissionsData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch commissions data', error);
        } finally {
            setLoading(false);
        }
    };

    const markCollected = async (id: number) => {
        if (!confirm('Are you sure you want to mark this commission as collected?')) return;
        try {
            await api.post(`/commissions/${id}/collect`, {});
            fetchData();
        } catch (error) {
            console.error('Failed to collect commission', error);
        }
    };

    return (
        <AdminLayout>
            <div>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Commission Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Track and collect commission from orders</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="card stat-card warning p-5">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Pending Commission</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">
                            {Number(stats.pending_amount || 0).toLocaleString()} DZD
                        </p>
                    </div>
                    <div className="card stat-card success p-5">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Collected Commission</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {Number(stats.paid_amount || 0).toLocaleString()} DZD
                        </p>
                    </div>
                    <div className="card stat-card accent p-5">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Commission Revenue</p>
                        <p className="text-2xl font-bold text-teal-600 mt-1">
                            {Number(stats.total_amount || 0).toLocaleString()} DZD
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="card p-6"><div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-12 w-full" />)}</div></div>
                ) : (
                    <div className="table-container card">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Store</th>
                                    <th>Order Total</th>
                                    <th>Commission</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commissions.map((commission) => (
                                    <tr key={commission.id}>
                                        <td className="font-medium text-gray-900">#{commission.order_id}</td>
                                        <td>{commission.store_name || commission.store_id}</td>
                                        <td className="text-gray-500">
                                            {Number(commission.order_total || 0).toLocaleString()} DZD
                                        </td>
                                        <td className="font-semibold text-teal-600">
                                            {Number(commission.amount).toLocaleString()} DZD
                                            <span className="text-xs font-normal text-gray-500 ml-1">({commission.rate}%)</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${commission.status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                                                {commission.status === 'PAID' ? 'Collected' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="text-gray-500">
                                            {new Date(commission.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {commission.status !== 'PAID' && (
                                                <button
                                                    onClick={() => markCollected(commission.id)}
                                                    className="btn btn-primary text-xs"
                                                >
                                                    Mark Collected
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {commissions.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="empty-state">💰 No commissions found.</td>
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
