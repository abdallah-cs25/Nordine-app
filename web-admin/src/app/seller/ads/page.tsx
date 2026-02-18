'use client';

import React, { useState } from 'react';
import SellerLayout from '@/components/SellerLayout';

export default function AdsManagement() {
    const [ads, setAds] = useState([
        { id: 1, title: 'Summer Sale', status: 'Active', clicks: 120 },
        { id: 2, title: 'New Arrival Promo', status: 'Inactive', clicks: 45 },
    ]);

    return (
        <SellerLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Ads & Offers</h1>
                    <p className="text-gray-500">Manage your store banners and special offers</p>
                </div>
                <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    + Create New Ad
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Create Ad Card */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 min-h-[200px]">
                    <span className="text-4xl text-gray-300 mb-2">+</span>
                    <h3 className="font-medium text-gray-600">Upload New Banner</h3>
                    <p className="text-sm text-gray-400 mt-1">1200x400px recommended</p>
                </div>

                {/* Existing Ads */}
                {ads.map(ad => (
                    <div key={ad.id} className="bg-white rounded-xl shadow overflow-hidden group relative">
                        <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{ad.title}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full ${ad.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {ad.status}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mt-4">
                                <span>{ad.clicks} Clicks</span>
                                <div className="space-x-2">
                                    <button className="text-indigo-600 hover:text-indigo-800">Edit</button>
                                    <button className="text-red-600 hover:text-red-800">Stop</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Campaign Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-2">💡 Pro Tip: Boost your sales</h3>
                <p className="text-blue-600 text-sm">
                    Offers with clear discounts (e.g., "50% OFF") get 3x more clicks.
                    Upload high-quality images to attract more customers on the home screen.
                </p>
            </div>
        </SellerLayout>
    );
}
