// Mock Data for Demo Mode
const mockData = {
    users: [
        { id: 1, name: 'Ahmed Admin', email: 'admin@myword.dz', password_hash: '$2a$10$rOzJJMTlEPvmGPLmEEy.4OE42L3RZNHZO1X8yHMmqQqE7B3cJwIZy', role: 'ADMIN', phone_number: '+213555000001', created_at: new Date() },
        { id: 2, name: 'Karim Store Owner', email: 'karim@store.dz', password_hash: '$2a$10$rOzJJMTlEPvmGPLmEEy.4OE42L3RZNHZO1X8yHMmqQqE7B3cJwIZy', role: 'SELLER', phone_number: '+213555000002', created_at: new Date() },
        { id: 3, name: 'Fatima Customer', email: 'fatima@user.dz', password_hash: '$2a$10$rOzJJMTlEPvmGPLmEEy.4OE42L3RZNHZO1X8yHMmqQqE7B3cJwIZy', role: 'CUSTOMER', phone_number: '+213555000003', created_at: new Date() },
        { id: 4, name: 'Omar Driver', email: 'omar@driver.dz', password_hash: '$2a$10$rOzJJMTlEPvmGPLmEEy.4OE42L3RZNHZO1X8yHMmqQqE7B3cJwIZy', role: 'DRIVER', phone_number: '+213555000004', created_at: new Date() }
    ],
    stores: [
        { id: 1, name: 'Gym Power', description: 'Best supplements', image_url: '', location_lat: 36.7, location_lng: 3.0, is_active: true },
        { id: 2, name: 'Fashion Hub', description: 'Trendy clothes', image_url: '', location_lat: 36.71, location_lng: 3.01, is_active: true },
        { id: 3, name: 'Tech Zone', description: 'Electronics', image_url: '', location_lat: 36.72, location_lng: 3.02, is_active: true }
    ],
    orders: [
        { id: 101, total_amount: 5000, status: 'DELIVERED', created_at: new Date() },
        { id: 102, total_amount: 2500, status: 'PENDING', created_at: new Date() },
        { id: 103, total_amount: 12000, status: 'ACCEPTED', created_at: new Date() }
    ],
    products: [
        { id: 1, name: 'Protein Whey', price: 9000, store_id: 1, category_id: 1 },
        { id: 2, name: 'T-Shirt Nike', price: 3000, store_id: 2, category_id: 2 }
    ]
};

module.exports = mockData;
