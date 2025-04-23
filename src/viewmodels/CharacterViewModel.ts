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

    const [sortField, setSortField] = useState<SortField>(SortField.NAME);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Funktion til at håndtere sorterede karakterer
    const sortedCharacters = useMemo(() => {
        if (!characters) return null;

        return [...characters].sort((a, b) => {
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
    }, [characters, sortField, sortDirection]);

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
        characters: sortedCharacters,
        loading,
        apiError,

        // Actions
        sortField,
        sortDirection,
        handleSort
    };
};