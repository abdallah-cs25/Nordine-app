'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { api } from '@/utils/api';

interface User {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    role: string;
    is_active: boolean;
    created_at: string;
    commission_rate?: number;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [roleFilter, setRoleFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // New User State
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        phone_number: '',
        role: 'CUSTOMER',
        commission_rate: 10
    });

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]); // Refetch when filter changes or just filter locally? API supports filter.

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let url = '/users?limit=100';
            if (roleFilter) url += `&role=${roleFilter}`;

            const data = await api.get(url);
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await api.post('/users', newUser);
            setShowModal(false);
            fetchUsers();
            setNewUser({
                name: '',
                email: '',
                password: '',
                phone_number: '',
                role: 'CUSTOMER',
                commission_rate: 10
            });
        } catch (error) {
            console.error('Failed to create user', error);
            alert('Failed to create user');
        }
    };

    const toggleStatus = async (user: User) => {
        if (!confirm(`Are you sure you want to ${user.is_active ? 'suspend' : 'activate'} this user?`)) return;
        try {
            await api.put(`/users/${user.id}`, { is_active: !user.is_active });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user status', error);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'badge-info';
            case 'SELLER': return 'badge-primary';
            case 'DRIVER': return 'badge-warning';
            default: return 'badge-neutral';
        }
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage platform users and roles</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <select
                            className="form-input w-auto"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="CUSTOMER">Customers</option>
                            <option value="SELLER">Sellers</option>
                            <option value="DRIVER">Drivers</option>
                            <option value="ADMIN">Admins</option>
                        </select>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary"
                        >
                            + Create User
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="card p-6"><div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-12 w-full" />)}</div></div>
                ) : (
                    <div className="table-container card">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="font-medium text-gray-900">{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone_number}</td>
                                        <td>
                                            <span className={`badge ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                {user.is_active ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex items-center space-x-2">
                                                <button className="text-sm text-teal-600 hover:text-teal-800 font-medium">Edit</button>
                                                <button
                                                    onClick={() => toggleStatus(user)}
                                                    className={`text-sm font-medium ${user.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                                >
                                                    {user.is_active ? 'Suspend' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="empty-state">👥 No users found.</td>
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
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New User</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="form-input"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="form-input"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="form-input"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="form-input"
                                    value={newUser.phone_number}
                                    onChange={e => setNewUser({ ...newUser, phone_number: e.target.value })}
                                />
                                <select
                                    className="form-input"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="SELLER">Seller</option>
                                    <option value="DRIVER">Driver</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                {(newUser.role === 'SELLER' || newUser.role === 'DRIVER') && (
                                    <input
                                        type="number"
                                        placeholder="Commission Rate (%)"
                                        className="form-input"
                                        value={newUser.commission_rate}
                                        onChange={e => setNewUser({ ...newUser, commission_rate: parseFloat(e.target.value) })}
                                    />
                                )}
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
