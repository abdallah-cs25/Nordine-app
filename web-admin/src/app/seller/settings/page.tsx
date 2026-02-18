'use client';

import React, { useState } from 'react';
import SellerLayout from '@/components/SellerLayout';

export default function SellerSettings() {
    const [storeName, setStoreName] = useState('Fashion Hub');
    const [specializations, setSpecializations] = useState(['Men', 'Women', 'Children']);
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag && !specializations.includes(newTag)) {
            setSpecializations([...specializations, newTag]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setSpecializations(specializations.filter(t => t !== tag));
    };

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
                            {specializations.map(tag => (
                                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
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
                        <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 font-medium">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </SellerLayout>
    );
}
