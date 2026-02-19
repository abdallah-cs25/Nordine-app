'use client';

import React, { useState, useEffect } from 'react';
import SellerLayout from '@/components/SellerLayout';
import { api } from '@/utils/api';

interface Ad {
    id: number;
    title: string;
    image_url: string;
    status: string; // 'Active' | 'Inactive' in UI, boolean is_active in DB
    is_active: boolean;
    clicks: number; // Not in DB schema yet? DB schema has store_id, title, image_url, ...
    start_date: string;
    end_date: string;
}

export default function AdsManagement() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // New Ad State
    const [newAd, setNewAd] = useState({
        title: '',
        image_url: '',
        start_date: '',
        end_date: '',
        is_active: true
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            // Helper to get store_id if needed, or rely on backend to filter by owner_id for SELLERS
            const data = await api.get('/ads/all');
            // Transform data if needed
            setAds(data.map((ad: any) => ({
                ...ad,
                status: ad.is_active ? 'Active' : 'Inactive',
                clicks: ad.clicks || 0 // Default if missing
            })));
        } catch (error) {
            console.error('Failed to fetch ads', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            // Upload immediately or wait for form submit? 
            // Let's upload immediately for preview
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await api.post('/upload', formData); // usage of axios logic inside api utility might need adjustment if api.post doesn't handle FormData automatically. 
                // Assuming api.post handles it or we use fetch directly. 
                // Let's assume standard fetch for upload to be safe if api wrapper is JSON specific
                // Actually the api utility usually sets Content-Type to application/json. 
                // We might need a specific upload call. 
                // Let's try finding the upload implementation first or just use fetch.

                // fallback to fetch for upload to avoid header issues
                const token = localStorage.getItem('token');
                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                const data = await uploadRes.json();
                setNewAd(prev => ({ ...prev, image_url: data.imageUrl }));
            } catch (error) {
                console.error('Image upload failed', error);
                alert('Image upload failed');
            }
        }
    };

    const handleCreate = async () => {
        try {
            // we need store_id. usually stored in user object or fetched.
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const storeId = user.store_id || (user.store && user.store.id);

            if (!storeId) {
                alert('Store information missing. Please re-login.');
                return;
            }

            await api.post('/ads', { ...newAd, store_id: storeId });
            setShowModal(false);
            fetchAds();
            setNewAd({ title: '', image_url: '', start_date: '', end_date: '', is_active: true });
            setImageFile(null);
        } catch (error) {
            console.error('Failed to create ad', error);
            alert('Failed to create ad');
        }
    };

    const toggleStatus = async (ad: Ad) => {
        try {
            await api.put(`/ads/${ad.id}`, { is_active: !ad.is_active });
            fetchAds();
        } catch (error) {
            console.error('Failed to update ad status', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this ad?')) return;
        try {
            await api.delete(`/ads/${id}`);
            setAds(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to delete ad', error);
        }
    };

    return (
        <SellerLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Ads & Offers</h1>
                    <p className="text-gray-500">Manage your store banners and special offers</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    + Create New Ad
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading ads...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Create Ad Card */}
                    <div
                        onClick={() => setShowModal(true)}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 min-h-[200px]"
                    >
                        <span className="text-4xl text-gray-300 mb-2">+</span>
                        <h3 className="font-medium text-gray-600">Upload New Banner</h3>
                        <p className="text-sm text-gray-400 mt-1">1200x400px recommended</p>
                    </div>

                    {/* Existing Ads */}
                    {ads.map(ad => (
                        <div key={ad.id} className="bg-white rounded-xl shadow overflow-hidden group relative">
                            <div
                                className="h-32 bg-gray-200 bg-cover bg-center"
                                style={{ backgroundImage: `url(${ad.image_url || '/placeholder-ad.jpg'})` }}
                            >
                                {!ad.image_url && <div className="h-full flex items-center justify-center text-gray-400">No Image</div>}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg truncate" title={ad.title}>{ad.title}</h3>
                                    <span className={`px-2 py-1 text-xs rounded-full ${ad.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {ad.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mt-4">
                                    <span>{ad.clicks} Clicks</span>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => toggleStatus(ad)}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            {ad.is_active ? 'Stop' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ad.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Campaign Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-2">💡 Pro Tip: Boost your sales</h3>
                <p className="text-blue-600 text-sm">
                    Offers with clear discounts (e.g., "50% OFF") get 3x more clicks.
                    Upload high-quality images to attract more customers on the home screen.
                </p>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Ad</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Ad Title (e.g., Summer Sale)"
                                className="w-full border rounded-lg px-4 py-2"
                                value={newAd.title}
                                onChange={e => setNewAd({ ...newAd, title: e.target.value })}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className="w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-purple-50 file:text-purple-700
                                    hover:file:bg-purple-100"
                                />
                                {newAd.image_url && (
                                    <img src={newAd.image_url} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" />
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg px-4 py-2"
                                        value={newAd.start_date}
                                        onChange={e => setNewAd({ ...newAd, start_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg px-4 py-2"
                                        value={newAd.end_date}
                                        onChange={e => setNewAd({ ...newAd, end_date: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                            <button onClick={handleCreate} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Create Ad</button>
                        </div>
                    </div>
                </div>
            )}
        </SellerLayout>
    );
}
