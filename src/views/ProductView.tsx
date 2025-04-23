import React from 'react';
import { useProductViewModel, SortField} from '../viewmodels/ProductViewModel';
import './ProductView.css';

export const ProductView: React.FC = () => {
    const {
        products,
        loading,
        apiError,
        formData,
        validationErrors,
        selectedProduct,
        handleInputChange,
        handleSubmit,
        selectProductForEdit,
        handleDelete,
        resetForm,
        sortField,
        sortDirection,
        handleSort
    } = useProductViewModel();

    const getSortIndicator = (field: SortField) => {
        if (sortField !== field) return '⋮';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="product-page">
            {/* <h1>Produkt Administration</h1> */}
            
            {/* Fejlmeddelelser */}
            {apiError && (
                <div className="error-message">
                    <p>{apiError}</p>
                </div>
            )}

            {/* Produkt formular */}

            {/* <div className="product-form-container">
                <h2>{selectedProduct ? 'Rediger Produkt' : 'Opret Nyt Produkt'}</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }} className="product-form">
                    <div className="form-group">
                        <label htmlFor="name">Produktnavn:</label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={validationErrors.name ? 'error' : ''}
                        />
                        {validationErrors.name && (
                            <span className="error-text">{validationErrors.name}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Pris (DKK):</label>
                        <input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            className={validationErrors.price ? 'error' : ''}
                        />
                        {validationErrors.price && (
                            <span className="error-text">{validationErrors.price}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Produkttype:</label>
                        <input
                            id="type"
                            type="text"
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className={validationErrors.type ? 'error' : ''}
                        />
                        {validationErrors.type && (
                            <span className="error-text">{validationErrors.type}</span>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {selectedProduct ? 'Opdater' : 'Opret'}
                        </button>
                        {selectedProduct && (
                            <button 
                                type="button" 
                                onClick={resetForm}
                                className="btn-secondary"
                            >
                                Annuller
                            </button>
                        )}
                    </div>
                </form>
            </div>
            */ }

            <div className="product-list-container">
                <div className="list-header">
                    <h2>Produkter</h2>
                    {/* Tilføj sorteringsvælger over produktlisten */}
                    <div className="sort-controls">
                        <button
                            className={`sort-button ${sortField === SortField.NAME ? 'active' : ''}`}
                            onClick={() => handleSort(SortField.NAME)}
                        >
                            Navn {getSortIndicator(SortField.NAME)}
                        </button>
                        <button
                            className={`sort-button ${sortField === SortField.PRICE ? 'active' : ''}`}
                            onClick={() => handleSort(SortField.PRICE)}
                        >
                            Pris {getSortIndicator(SortField.PRICE)}
                        </button>
                        <button
                            className={`sort-button ${sortField === SortField.TYPE ? 'active' : ''}`}
                            onClick={() => handleSort(SortField.TYPE)}
                        >
                            Type {getSortIndicator(SortField.TYPE)}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Indlæser...</div>
                ) : (
                    <div className="product-grid">
                        {products?.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="price">{product.price.toFixed(2)} DKK</p>
                                    <p className="type">{product.type}</p>
                                </div>
                                <div className="product-actions">
                                    <button
                                        onClick={() => selectProductForEdit(product)}
                                        className="btn-edit"
                                    >
                                        Rediger
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="btn-delete"
                                    >
                                        Slet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};