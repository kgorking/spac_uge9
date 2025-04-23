import { useState, useMemo } from 'react';
import { useProduct } from '../hooks/Product.ts';
//import { Product } from '../models/Product.ts';

export enum SortField {
    NAME = 'name',
    PRICE = 'price',
    TYPE = 'type'
}

export const useProductViewModel = () => {
    const { 
        products, 
        loading, 
        error: apiError
    } = useProduct();

    const [sortField, setSortField] = useState<SortField>(SortField.NAME);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Funktion til at håndtere sorterede produkter
    const sortedProducts = useMemo(() => {
        if (!products) return null;

        return [...products].sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case SortField.NAME:
                    comparison = a.name.localeCompare(b.name);
                    break;
                case SortField.PRICE:
                    comparison = a.price - b.price;
                    break;
                case SortField.TYPE:
                    comparison = a.type.localeCompare(b.type);
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [products, sortField, sortDirection]);

    // Funktion til at ændre sortering
    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return {
        // State
        products: sortedProducts,
        loading,
        apiError,

        // Actions
        sortField,
        sortDirection,
        handleSort
    };
};