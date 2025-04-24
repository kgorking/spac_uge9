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
        handleSort,
        searchQuery,
        setSearchQuery,
    } = useCharacterViewModel();

    // Tilføj state for citater
    const [sayingsIndex, setSayingsIndex] = React.useState<number>(0);

    // Hjælpefunktion til sorteringsindikator
    const getSortIndicator = (field: SortField) => {
        if (sortField !== field) return '⋮';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    // Opdater citaterne løbende
    React.useEffect(() => {
        const timer = setInterval(() => {
            setSayingsIndex(prevState => {
                return 1 + prevState;
            });
        }, 10000);

        return () => clearInterval(timer);
    }, [characters]);

    return (
        <div className="character-page">
            <h1>Futurama karakteroversigt</h1>

            {apiError && (
                <div className="error-message">
                    <p>{apiError}</p>
                </div>
            )}

            <div className="character-container">
                <div className="list-header">
                    <input
                        type="text"
                        className="search-box"
                        placeholder="Søg efter karakterer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Søg efter karakterer"
                    />
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
                            const currentSayingIndex = sayingsIndex % character.sayings.length;

                            return (
                                <div className="character-card">
                                    <img className="character-image"
                                        src={character.images.main}
                                        alt={`${character.name.first} ${character.name.last}`}
                                    />

                                    <div className="character-info">
                                        <h3>{character.name.last}, {character.name.first} {character.name.middle}</h3>
                                        <div className="character-details">
                                            <p><strong>Alder:</strong> {character.age} år</p>
                                            <p><strong>Køn:</strong> {character.gender}</p>
                                            <p><strong>Art:</strong> {character.species}</p>
                                            <p><strong>Beskæftigelse:</strong> {character.occupation}</p>
                                            <p className="character-saying" onClick={() => setSayingsIndex(1+sayingsIndex)}>
                                                <em key={currentSayingIndex}>"{character.sayings[currentSayingIndex]}"</em>
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