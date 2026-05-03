const API_URL = 'https://shfe-diplom.neto-server.ru';

export async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Ошибка запроса');
        }
        return data.result;
    } catch (error) {
        console.error(`API Error ${endpoint}:`, error);
        throw error;
    }
}

export async function getAllData() {
    return apiRequest('/alldata');
}