'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

interface Store {
    id: number;
    name: string;
    owner_id: number;
    owner_name?: string; // from join
    description: string;
    is_active: boolean;
    created_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [potentialOwners, setPotentialOwners] = useState<User[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        owner_id: '',
        description: '',
        commission_rate: '10'
    });

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const data = await api.get('/stores');
            setStores(data);
        } catch (error) {
            console.error('Failed to fetch stores', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPotentialOwners = async () => {
        try {
            // ideally filter for SELLERS or potential sellers
            const data = await api.get('/users?role=SELLER');
            setPotentialOwners(data.users || []); // adjust based on API response structure
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const openAddModal = () => {
        fetchPotentialOwners();
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/stores', {
                name: formData.name,
                owner_id: parseInt(formData.owner_id),
                description: formData.description,
                commission_rate: parseFloat(formData.commission_rate)
            });
            setShowModal(false);
            fetchStores();
            // Reset form
            setFormData({ name: '', owner_id: '', description: '', commission_rate: '10' });
        } catch (error) {
            console.error('Failed to create store', error);
            alert('Failed to create store');
        }
    };

    const toggleStatus = async (store: Store) => {
        if (!confirm(`Are you sure you want to ${store.is_active ? 'disable' : 'enable'} this store?`)) return;
        try {
            await api.put(`/stores/${store.id}`, { is_active: !store.is_active });
            fetchStores();
        } catch (error) {
            console.error('Failed to update store', error);
        }
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Stores Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage all marketplace stores</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="btn btn-primary"
                    >
                        + Add Store
                    </button>
                </div>

                {loading ? (
                    <div className="card p-6"><div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-12 w-full" />)}</div></div>
                ) : (
                    <div className="table-container card">
                        <table>
                            <thead>
                                <tr>
                                    <th>Store Name</th>
                                    <th>Owner ID</th>
                                    <th>Commission</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stores.map((store) => (
                                    <tr key={store.id}>
                                        <td className="font-medium text-gray-900">{store.name}</td>
                                        <td>{store.owner_id}</td>
                                        <td>10%</td>
                                        <td>
                                            <span className={`badge ${store.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                {store.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center space-x-2">
                                                <button className="text-sm text-teal-600 hover:text-teal-800 font-medium">View</button>
                                                <button
                                                    onClick={() => toggleStatus(store)}
                                                    className={`text-sm font-medium ${store.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                                >
                                                    {store.is_active ? 'Disable' : 'Enable'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {stores.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="empty-state">🏪 No stores found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Add Store Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Store</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="form-label">Store Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Owner (Seller)</label>
                                        <select
                                            name="owner_id"
                                            value={formData.owner_id}
                                            onChange={handleInputChange}
                                            required
                                            className="form-input"
                                        >
                                            <option value="">Select Owner</option>
                                            {potentialOwners.map(user => (
                                                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Commission Rate (%)</label>
                                        <input
                                            name="commission_rate"
                                            type="number"
                                            value={formData.commission_rate}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn btn-outline"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Create Store
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
