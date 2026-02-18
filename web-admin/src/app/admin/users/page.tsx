'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    orders: number;
    joined: string;
}

const mockUsers: User[] = [
    { id: 1, name: 'Ahmed Admin', email: 'admin@myword.dz', phone: '+213555000001', role: 'ADMIN', status: 'Active', orders: 0, joined: '2026-01-01' },
    { id: 2, name: 'Karim Store', email: 'karim@store.dz', phone: '+213555000002', role: 'SELLER', status: 'Active', orders: 89, joined: '2026-01-05' },
    { id: 3, name: 'Fatima User', email: 'fatima@user.dz', phone: '+213555000003', role: 'CUSTOMER', status: 'Active', orders: 12, joined: '2026-01-10' },
    { id: 4, name: 'Omar Driver', email: 'omar@driver.dz', phone: '+213555000004', role: 'DRIVER', status: 'Active', orders: 156, joined: '2026-01-08' },
    { id: 5, name: 'Sara Customer', email: 'sara@user.dz', phone: '+213555000005', role: 'CUSTOMER', status: 'Suspended', orders: 5, joined: '2026-01-15' },
];

export default function UsersPage() {
    const [users] = useState<User[]>(mockUsers);
    const [roleFilter, setRoleFilter] = useState('');

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-100 text-purple-700';
            case 'SELLER': return 'bg-blue-100 text-blue-700';
            case 'DRIVER': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredUsers = roleFilter
        ? users.filter(u => u.role === roleFilter)
        : users;

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Users Management</h1>
                    <div className="flex space-x-2">
                        <select
                            className="border rounded-lg px-4 py-2"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="CUSTOMER">Customers</option>
                            <option value="SELLER">Sellers</option>
                            <option value="DRIVER">Drivers</option>
                            <option value="ADMIN">Admins</option>
                        </select>
                        <input type="text" placeholder="Search..." className="border rounded-lg px-4 py-2" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Customers</p>
                        <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'CUSTOMER').length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Sellers</p>
                        <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'SELLER').length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Drivers</p>
                        <p className="text-2xl font-bold text-orange-600">{users.filter(u => u.role === 'DRIVER').length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Admins</p>
                        <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'ADMIN').length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4">User</th>
                                <th className="text-left p-4">Email</th>
                                <th className="text-left p-4">Phone</th>
                                <th className="text-left p-4">Role</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Joined</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.phone}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{user.joined}</td>
                                    <td className="p-4">
                                        <button className="text-blue-500 hover:underline mr-2">Edit</button>
                                        <button className="text-red-500 hover:underline">
                                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                        </button>
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
