import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-xl font-bold">My Word Admin</h1>
                    <p className="text-gray-400 text-sm">Management Dashboard</p>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/admin" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                                <span className="mr-3">📊</span> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/analytics" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                                <span className="mr-3">📈</span> Analytics
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/stores" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                                <span className="mr-3">🏪</span> Stores
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/products" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                                <span className="mr-3">📦</span> Products
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/orders" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                                <span className="mr-3">🛒</span> Orders
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/drivers" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                                <span className="mr-3">🚗</span> Drivers
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/commissions" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                                <span className="mr-3">💰</span> Commissions
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/coupons" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                                <span className="mr-3">🏷️</span> Coupons
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/users" className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition">
                                <span className="mr-3">👥</span> Users
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <div>
                        <input type="text" placeholder="Search..." className="px-4 py-2 border rounded-lg w-64" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full">🔔</button>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-teal-500 rounded-full mr-2"></div>
                            <span>Admin</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
