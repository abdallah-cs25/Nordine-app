'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('store');
        router.push('/');
    };

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
        { name: 'Stores', href: '/admin/stores', icon: '🏪' },
        { name: 'Products', href: '/admin/products', icon: '📦' },
        { name: 'Orders', href: '/admin/orders', icon: '🛒' },
        { name: 'Drivers', href: '/admin/drivers', icon: '🚗' },
        { name: 'Commissions', href: '/admin/commissions', icon: '💰' },
        { name: 'Coupons', href: '/admin/coupons', icon: '🏷️' },
        { name: 'Users', href: '/admin/users', icon: '👥' },
        { name: 'Ads & Offers', href: '/admin/ads', icon: '📢' },
    ];

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <div className="flex h-screen bg-gray-50">
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
                className={`bg-gray-900 text-white flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}
                role="navigation"
                aria-label="Admin sidebar"
            >
                <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
                    <div className={`${!sidebarOpen && 'md:hidden'}`}>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                            My Word Admin
                        </h1>
                        <p className="text-gray-500 text-xs mt-0.5">{user?.name || 'Management Dashboard'}</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hidden md:flex"
                        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-150 group
                                    ${active
                                        ? 'bg-teal-600/20 text-teal-400 font-medium shadow-sm shadow-teal-900/20'
                                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                                    }`}
                                aria-current={active ? 'page' : undefined}
                            >
                                <span className={`text-lg ${active ? 'scale-110' : 'group-hover:scale-105'} transition-transform`}>
                                    {item.icon}
                                </span>
                                <span className={`ml-3 text-sm ${!sidebarOpen && 'md:hidden'}`}>{item.name}</span>
                                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-gray-800/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors"
                        aria-label="Logout"
                    >
                        <span className="text-lg">🚪</span>
                        <span className={`ml-3 text-sm ${!sidebarOpen && 'md:hidden'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                {/* Header */}
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
                    <div className="flex items-center space-x-3 ml-auto">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative" aria-label="Notifications">
                            <span className="text-lg">🔔</span>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
                            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user?.name || 'Admin'}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 md:p-6 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
