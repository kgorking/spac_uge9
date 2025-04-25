import React from 'react';
import { useCharacterViewModel, SortField } from '../viewmodels/CharacterViewModel';
import './CharacterView.css';

export const CharacterView: React.FC = () => {
    const {
        characters,
        loading,
        error,
        sortField,
        sortDirection,
        handleSort,
        searchQuery,
        setSearchQuery,
    } = useCharacterViewModel();

    // Tilføj state for citater
    const [sayingCounter, setSayingCounter] = React.useState<number>(0);

    // Hjælpefunktion til sorteringsindikator
    const getSortIndicator = (field: SortField) => {
        if (sortField !== field) return '';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    // Opdater citat tælleren
    React.useEffect(() => {
        const updateCounter = () => { setSayingCounter(prevState => 1 + prevState); };
        const timer = setInterval(updateCounter, 10000);
        return () => clearInterval(timer);
    }, [characters]);

    return (
        <div className="character-page">
            <h1>Futurama karakteroversigt</h1>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
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
                        {Object.values(SortField).map(field => (
                            <button
                            className={`sort-button ${sortField === field ? 'active' : ''}`}
                                onClick={() => handleSort(field)}
                                key={field}
                            >
                                {field} {getSortIndicator(field)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">Indlæser karakterer...</div>
                ) : (
                    <div className="character-grid">
                        {characters?.map(character => {
                            const currentSayingIndex = sayingCounter % character.sayings.length;
                            const saying = character.sayings[currentSayingIndex];

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
                                            <p className="character-saying" onClick={() => setSayingCounter(1+sayingCounter)}>
                                                <em key={currentSayingIndex}>"{saying}" - {character.name.first} {character.name.middle} {character.name.last}</em>
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