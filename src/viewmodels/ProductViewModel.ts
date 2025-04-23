import { useState, useCallback, useMemo } from 'react';
import { useProduct } from '../hooks/Product.ts';
import { Product } from '../models/Product.ts';

interface ProductFormData {
    name: string;
    price: string;
    type: string;
}

interface ValidationErrors {
    name?: string;
    price?: string;
    type?: string;
}

export enum SortField {
    NAME = 'name',
    PRICE = 'price',
    TYPE = 'type'
}

export const useProductViewModel = () => {
    const { 
        products, 
        loading, 
        error: apiError, 
        createProduct, 
        updateProduct, 
        deleteProduct 
    } = useProduct();

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        price: '',
        type: ''
    });

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [sortField, setSortField] = useState<SortField>(SortField.NAME);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Valideringsfunktion
    const validateForm = (data: ProductFormData): ValidationErrors => {
        const errors: ValidationErrors = {};
        
        if (!data.name.trim()) {
            errors.name = "Name is required.";
        }

        const price = parseFloat(data.price);
        if (!data.price || isNaN(price) || price <= 0) {
            errors.price = "Price must be valid and greater than zero.";
        }

        if (!data.type.trim()) {
            errors.type = "Type is required.";
        }

        return errors;
    };

    // Håndter input ændringer
    const handleInputChange = useCallback((name: keyof ProductFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Ryd validerings fejl når bruger begynder at skrive
        setValidationErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
    }, []);

    // Håndter form submission
    const handleSubmit = async () => {
        const errors = validateForm(formData);
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const productData = {
            name: formData.name.trim(),
            price: parseFloat(formData.price),
            type: formData.type.trim()
        };

        try {
            if (selectedProduct) {
                await updateProduct({
                    ...productData,
                    id: selectedProduct.id
                });
            } else {
                await createProduct(productData);
            }
            
            // Nulstil form efter succes
            resetForm();
        } catch (error) {
            // Fejl håndteres allerede i hooket
            console.error('Handling submission failed:', error);
        }
    };

    // Vælg produkt til redigering
    const selectProductForEdit = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            type: product.type
        });
    };

    // Nulstil formular
    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            type: ''
        });
        setValidationErrors({});
        setSelectedProduct(null);
    };

    // Håndter sletning
    const handleDelete = async (id: number) => {
        if (window.confirm('Er du sikker på at du vil slette dette produkt?')) {
            await deleteProduct(id);
        }
    };

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
        formData,
        validationErrors,
        selectedProduct,

        // Actions
        handleInputChange,
        handleSubmit,
        selectProductForEdit,
        handleDelete,
        resetForm,
        sortField,
        sortDirection,
        handleSort
    };
};