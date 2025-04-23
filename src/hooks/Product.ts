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

    // Opret nyt produkt
    const createProduct = async (product: Omit<Product, 'id'>) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) {
                throw new Error('Kunne ikke oprette produkt');
            }
            const newProduct = await response.json();
            setState(prev => ({
                data: prev.data ? [...prev.data, newProduct] : [newProduct],
                error: null,
                loading: false
            }));
            return newProduct;
        } catch (error) {
            setState(prev => ({ 
                ...prev,
                error: (error as ApiError).message || 'Der opstod en fejl', 
                loading: false 
            }));
            throw error;
        }
    };

    // Opdater eksisterende produkt
    const updateProduct = async (product: Product) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch(`${API_BASE_URL}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) {
                throw new Error('Kunne ikke opdatere produkt. ' + response.status);
            }
            //const updatedProduct = await response.json();
            setState(prev => ({
                data: prev.data 
                    ? prev.data.map(p => p.id === product.id ? product : p)
                    : [product],
                error: null,
                loading: false
            }));
            return product;
        } catch (error) {
            setState(prev => ({ 
                ...prev,
                error: (error as ApiError).message || 'Der opstod en fejl', 
                loading: false 
            }));
            throw error;
        }
    };

    // Slet produkt
    const deleteProduct = async (id: number) => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Kunne ikke slette produkt');
            }
            setState(prev => ({
                data: prev.data ? prev.data.filter(p => p.id !== id) : null,
                error: null,
                loading: false
            }));
        } catch (error) {
            setState(prev => ({ 
                ...prev,
                error: (error as ApiError).message || 'Der opstod en fejl', 
                loading: false 
            }));
            throw error;
        }
    };

    // Hent produkter ved komponent montering
    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products: state.data,
        loading: state.loading,
        error: state.error,
        createProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: fetchProducts
    };
};