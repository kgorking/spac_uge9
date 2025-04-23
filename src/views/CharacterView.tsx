import React from 'react';
import { useCharacterViewModel, SortField } from '../viewmodels/CharacterViewModel';
import './CharacterView.css';

export const CharacterView: React.FC = () => {
    const {
        characters,
        loading,
        apiError,
        sortField,
        sortDirection,
        handleSort
    } = useCharacterViewModel();

    // Tilføj state for citater
    const [sayingsIndex, setSayingsIndex] = React.useState<number>(0);

    // Hjælpefunktion til sorteringsindikator
    const getSortIndicator = (field: SortField) => {
        if (sortField !== field) return '⋮';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    React.useEffect(() => {
        const images = document.querySelectorAll('.character-image img');

        const handleImageLoad = (e: Event) => {
            const img = e.target as HTMLImageElement;
            img.classList.add('loaded');
        };

        images.forEach(img => {
            if (img instanceof HTMLImageElement) {
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', handleImageLoad);
                }
            }
        });

        return () => {
            images.forEach(img => {
                if (img instanceof HTMLImageElement) {
                    img.removeEventListener('load', handleImageLoad);
                }
            });
        };
    }, [characters]);

    // Opdater citaterne løbende
    React.useEffect(() => {
        const timer = setInterval(() => {
            setSayingsIndex(prevState => {
                return 1 + prevState;
            });
        }, 7500);

        return () => clearInterval(timer);
    }, [characters]);

    return (
        <div className="character-page">
            <h1>Karakteroversigt</h1>

            {apiError && (
                <div className="error-message">
                    <p>{apiError}</p>
                </div>
            )}

            <div className="character-container">
                <div className="list-header">
                    <div className="sort-controls">
                        <button 
                            className={`sort-button ${sortField === SortField.NAME ? 'active' : ''}`}
                            onClick={() => handleSort(SortField.NAME)}
                        >
                            Navn {getSortIndicator(SortField.NAME)}
                        </button>
                        <button 
                            className={`sort-button ${sortField === SortField.AGE ? 'active' : ''}`}
                            onClick={() => handleSort(SortField.AGE)}
                        >
                            Alder {getSortIndicator(SortField.AGE)}
                        </button>
                        <button 
                            className={`sort-button ${sortField === SortField.GENDER ? 'active' : ''}`}
                            onClick={() => handleSort(SortField.GENDER)}
                        >
                            Køn {getSortIndicator(SortField.GENDER)}
                        </button>
                        <button 
                            className={`sort-button ${sortField === SortField.SPECIES ? 'active' : ''}`}
                            onClick={() => handleSort(SortField.SPECIES)}
                        >
                            Art {getSortIndicator(SortField.SPECIES)}
                        </button>
                        <button 
                            className={`sort-button ${sortField === SortField.OCCUPATION ? 'active' : ''}`}
                            onClick={() => handleSort(SortField.OCCUPATION)}
                        >
                            Beskæftigelse {getSortIndicator(SortField.OCCUPATION)}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Indlæser karakterer...</div>
                ) : (
                    <div className="character-grid">
                        {characters?.map(character => {
                            const characterKey = `${character.name.first}-${character.name.last}`;
                            const currentSayingIndex = sayingsIndex % character.sayings.length;

                            return (
                                <div key={`${character.name.first}-${character.name.last}`} className="character-card">
                                    <div className="character-image">
                                        <img
                                            src={character.images.main}
                                            alt={`${character.name.first} ${character.name.last}`}
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="character-info">
                                        <h3>{character.name.last}, {character.name.first}</h3>
                                        <div className="character-details">
                                            <p><strong>Alder:</strong> {character.age} år</p>
                                            <p><strong>Køn:</strong> {character.gender}</p>
                                            <p><strong>Art:</strong> {character.species}</p>
                                            <p><strong>Beskæftigelse:</strong> {character.occupation}</p>
                                            <p className="character-saying" onClick={() => setSayingsIndex(1+sayingsIndex)}>
                                                <em key={`${characterKey}-${currentSayingIndex}`}>"{character.sayings[currentSayingIndex]}"</em>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};