'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', href: '/seller', icon: '📊' },
        { name: 'My Products', href: '/seller/products', icon: '📦' },
        { name: 'Ads & Offers', href: '/seller/ads', icon: '📣' },
        { name: 'My Orders', href: '/seller/orders', icon: '🛍️' },
        { name: 'Store Settings', href: '/seller/settings', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-10`}>
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className={`font-bold text-xl text-teal-600 ${!sidebarOpen && 'hidden'}`}>My Store</h2>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-gray-100">
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center p-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-teal-50 text-teal-700 font-medium border-r-4 border-teal-500'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <button className="flex items-center text-red-500 w-full p-2 hover:bg-red-50 rounded-lg">
                        <span>🚪</span>
                        <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-0">
                    <h1 className="text-xl font-semibold text-gray-800">Seller Portal</h1>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                            S
                        </div>
                    </div>
                </header>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
