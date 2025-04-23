import { useState, useEffect } from 'react';
import { Product } from '../models/Product.ts';

// Base URL for API
const API_BASE_URL = 'https://localhost:7152/api/product';

// Type for API response
interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

// Type for API error
interface ApiError {
    message: string;
}

export const useProduct = () => {
    const [state, setState] = useState<ApiResponse<Product[]>>({
        data: null,
        error: null,
        loading: false
    });

    // Hent alle produkter
    const fetchProducts = async () => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error('Kunne ikke hente produkter');
            }
            const data = await response.json();
            setState({ data, error: null, loading: false });
        } catch (error) {
            setState({ 
                data: null, 
                error: (error as ApiError).message || 'Der opstod en fejl', 
                loading: false 
            });
        }
    };

    // Hent produkter ved komponent montering
    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products: state.data,
        loading: state.loading,
        error: state.error
    };
};