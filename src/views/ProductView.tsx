import React from 'react';
import { useProductViewModel, SortField} from '../viewmodels/ProductViewModel';
import './ProductView.css';

export const ProductView: React.FC = () => {
    const {
        products,
        loading,
        apiError,
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
            {/* Fejlmeddelelser */}
            {apiError && (
                <div className="error-message">
                    <p>{apiError}</p>
                </div>
            )}

            {/* Produkt formular */}

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
                                <table className="product-info" width="100%">
                                    <tr>
                                        <td align='left'><h3>{product.name}</h3></td>
                                        <td align='right'><p className="price">{product.price.toFixed(2)} DKK</p></td>
                                        <td align='right'><p className="type">{product.type}</p></td>
                                    </tr>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};