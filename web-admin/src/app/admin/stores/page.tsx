'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';

interface Store {
    id: number;
    name: string;
    owner: string;
    category: string;
    status: string;
    orders: number;
}

const mockStores: Store[] = [
    { id: 1, name: 'Gym Power', owner: 'Ahmed M.', category: 'Gym', status: 'Active', orders: 89 },
    { id: 2, name: 'Fashion Hub', owner: 'Sara K.', category: 'Clothing', status: 'Active', orders: 76 },
    { id: 3, name: 'Tech World', owner: 'Omar B.', category: 'Electronics', status: 'Active', orders: 54 },
    { id: 4, name: 'Perfume Palace', owner: 'Fatima H.', category: 'Perfumes', status: 'Pending', orders: 0 },
];

export default function StoresPage() {
    const [stores] = useState<Store[]>(mockStores);

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Stores Management</h1>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition">
                        + Add Store
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4">Store Name</th>
                                <th className="text-left p-4">Owner</th>
                                <th className="text-left p-4">Category</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Orders</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((store) => (
                                <tr key={store.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{store.name}</td>
                                    <td className="p-4">{store.owner}</td>
                                    <td className="p-4">{store.category}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm ${store.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {store.status}
                                        </span>
                                    </td>
                                    <td className="p-4">{store.orders}</td>
                                    <td className="p-4">
                                        <button className="text-blue-500 hover:underline mr-2">View</button>
                                        <button className="text-red-500 hover:underline">Disable</button>
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
