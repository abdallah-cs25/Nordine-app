'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userName, setUserName] = useState('Seller');
    const [storeName, setStoreName] = useState('My Store');
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const store = JSON.parse(localStorage.getItem('store') || '{}');
        if (user.name) setUserName(user.name);
        if (store.name) setStoreName(store.name);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('store');
        router.push('/');
    };

    const menuItems = [
        { name: 'Dashboard', href: '/seller', icon: '📊' },
        { name: 'My Products', href: '/seller/products', icon: '📦' },
        { name: 'Ads & Offers', href: '/seller/ads', icon: '📣' },
        { name: 'My Orders', href: '/seller/orders', icon: '🛍️' },
        { name: 'Store Settings', href: '/seller/settings', icon: '⚙️' },
    ];

    const isActive = (href: string) => {
        if (href === '/seller') return pathname === '/seller';
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`bg-white border-r border-gray-200/80 shadow-sm flex flex-col fixed h-full z-40 transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}
                role="navigation"
                aria-label="Seller sidebar"
            >
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div className={`${!sidebarOpen && 'md:hidden'}`}>
                        <h2 className="font-bold text-lg bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                            {storeName}
                        </h2>
                        <p className="text-gray-400 text-xs mt-0.5">Seller Portal</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hidden md:flex"
                        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {menuItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-150 group
                                    ${active
                                        ? 'bg-teal-50 text-teal-700 font-medium shadow-sm border border-teal-100'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                    }`}
                                aria-current={active ? 'page' : undefined}
                            >
                                <span className={`text-lg ${active ? 'scale-110' : 'group-hover:scale-105'} transition-transform`}>
                                    {item.icon}
                                </span>
                                <span className={`ml-3 text-sm ${!sidebarOpen && 'md:hidden'}`}>{item.name}</span>
                                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-red-400 w-full px-3 py-2.5 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Logout"
                    >
                        <span className="text-lg">🚪</span>
                        <span className={`ml-3 text-sm ${!sidebarOpen && 'md:hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-4 py-3 flex justify-between items-center sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800 hidden md:block">Seller Portal</h1>
                    <div className="flex items-center space-x-3 ml-auto">
                        <span className="text-sm text-gray-500 hidden sm:inline">{userName}</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-6 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
