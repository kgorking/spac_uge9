import { useState, useEffect } from 'react';
import { Character } from '../models/Character.ts';

// Base URL for API
const API_BASE_URL = 'https://api.sampleapis.com/futurama/characters';

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

export const useCharacter = () => {
    const [state, setState] = useState<ApiResponse<Character[]>>({
        data: null,
        error: null,
        loading: false
    });

    // Hent alle produkter
    const fetchCharacters = async () => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error('Kunne ikke hente karakterer');
            }
            const data: Character[] = await response.json();
            setState({ data, error: null, loading: false });
        } catch (error) {
            setState({
                data: null,
                error: (error as ApiError).message || 'Der opstod en fejl',
                loading: false
            });
        }
    };

    // Hent karakterer ved komponent montering
    useEffect(() => {
        fetchCharacters().then();
    }, []);

    return {
        characters: state.data,
        loading: state.loading,
        error: state.error
    };
};