import axios from 'axios';

const API_URL = 'https://api.example.com/products'; // Replace with your actual API endpoint

export const fetchProducts = async (page = 1, size = 20, keyword = '', onlySelling = true) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                page,
                size,
                keyword,
                onlySelling,
            },
        });
        return response.data; // Adjust based on your API response structure
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data; // Adjust based on your API response structure
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
};