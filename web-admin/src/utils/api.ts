const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = {
    async get(endpoint: string) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || `Error ${res.status}`);
        }
        return res.json();
    },

    async post(endpoint: string, data: any) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || `Error ${res.status}`);
        }
        return res.json();
    },

    async put(endpoint: string, data: any) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || `Error ${res.status}`);
        }
        return res.json();
    },

    async delete(endpoint: string) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.error || `Error ${res.status}`);
        }
        return res.json();
    }
};
