import { useState, useMemo } from 'react';
import { useCharacter } from '../hooks/CharacterHook.ts';

export enum SortField {
    NAME = 'name',
    AGE = 'age',
    GENDER = 'gender',
    SPECIES = 'species',
    OCCUPATION = 'occupation'
}

export const useCharacterViewModel = () => {
    const {
        characters,
        loading,
        error: apiError
    } = useCharacter();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>(SortField.NAME);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Funktion til at håndtere søgning og sortering af karakterer
    const reducedCharacters = useMemo(() => {
        if (!characters) return null;

        // Filter characters based on a search query.
        let reduced = characters;
        const searchText = searchQuery.toLowerCase();
        if (searchText) {
            reduced = reduced.filter(character => {
                const searchFields = [
                    character.name.first,
                    character.name.middle,
                    character.name.last,
                    character.age.toString(),
                    character.species,
                    character.occupation,
                    character.gender,
                    //...character.sayings.map(saying => saying)
                ];

                return searchFields.some(field => field.toLowerCase().includes(searchText));
            });
        }

        return [...reduced].sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case SortField.NAME:
                    comparison = a.name.last.localeCompare(b.name.last);
                    break;
                case SortField.AGE:
                    comparison = a.age - b.age;
                    break;
                case SortField.GENDER:
                    comparison = a.gender.localeCompare(b.gender);
                    break;
                case SortField.SPECIES:
                    comparison = a.species.localeCompare(b.gender);
                    break;
                case SortField.OCCUPATION:
                    comparison = a.occupation.localeCompare(b.gender);
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [characters, sortField, sortDirection, searchQuery]);

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
        characters: reducedCharacters,
        loading,
        apiError,

        // Actions
        sortField,
        sortDirection,
        handleSort,
        searchQuery,
        setSearchQuery
    };
};