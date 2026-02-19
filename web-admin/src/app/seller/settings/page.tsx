'use client';

import React, { useState, useEffect } from 'react';
import SellerLayout from '@/components/SellerLayout';
import { api } from '@/utils/api';

export default function SellerSettings() {
    const [store, setStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [storeName, setStoreName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        fetchStoreData();
    }, []);

    const fetchStoreData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const storedStore = JSON.parse(localStorage.getItem('store') || 'null'); // We might have stored it separately or inside user
            // Actually login response has { user, store, token }. 
            // We usually store token and user. If we didn't store 'store' object, we might need to rely on what we have.
            // Let's assume we can get it from localStorage if we saved it on login.

            let storeId = storedStore?.id || user.store_id;

            if (!storeId && user.role === 'SELLER') {
                // Determine store ID if not readily available
                // We can fetch from /ads?store_id=... no wait.
                // We really should have stored it. 
                // If not available, we can fail gracefully or ask to relogin.
            }

            if (storeId) {
                const data = await api.get(`/stores/${storeId}`);
                setStore(data);
                setStoreName(data.name);
                setDescription(data.description || '');
                setAddress(data.address || '');
                setImageUrl(data.image_url || '');
                setSpecializations(data.specializations || []);
            }
        } catch (error) {
            console.error('Failed to fetch store settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTag = () => {
        if (newTag && !specializations.includes(newTag)) {
            setSpecializations([...specializations, newTag]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setSpecializations(specializations.filter(t => t !== tag));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('image', file);

            try {
                const token = localStorage.getItem('token');
                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const data = await uploadRes.json();
                setImageUrl(data.imageUrl);
            } catch (error) {
                console.error('Image upload failed', error);
                alert('Image upload failed');
            }
        }
    };

    const handleSave = async () => {
        if (!store) return;
        try {
            await api.put(`/stores/${store.id}`, {
                name: storeName,
                description,
                address,
                image_url: imageUrl,
                specializations
            });
            alert('Settings saved successfully!');
            // Update local storage if needed
            const updatedStore = { ...store, name: storeName, image_url: imageUrl, specializations };
            localStorage.setItem('store', JSON.stringify(updatedStore));
        } catch (error) {
            console.error('Failed to save settings', error);
            alert('Failed to save settings');
        }
    };

    if (loading) return <SellerLayout><div>Loading settings...</div></SellerLayout>;

    return (
        <SellerLayout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Store Settings</h1>

                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                        <input
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Store Image</label>
                        <div className="flex items-center space-x-4">
                            {imageUrl && <img src={imageUrl} alt="Store" className="w-16 h-16 rounded-full object-cover" />}
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Specializations / Tags
                            <span className="text-gray-500 text-xs ml-2">(e.g., Men, Pizza, Organic)</span>
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Add a specialty..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            />
                            <button
                                onClick={handleAddTag}
                                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                            >
                                Add
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {specializations.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                                    {tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-teal-600 hover:text-teal-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <button
                            onClick={handleSave}
                            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 font-medium"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
