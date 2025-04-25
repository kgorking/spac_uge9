import { useState, useEffect } from 'react';
import { Character } from '../models/Character.ts';

// Type for API response
interface ApiResponse {
    data: Character[] | null;
    error: string | null;
    loading: boolean;
}

export const useCharacter = () => {
    const [state, setState] = useState<ApiResponse>({
        data: null,
        error: null,
        loading: false
    });

    // Hent Futurama karakterer fra API
    const fetchCharacters = async () => {
        setState(prev => ({ ...prev, loading: true }));

        await fetch('https://api.sampleapis.com/futurama/characters')
            .then(response => response.ok ? response.json() : Promise.reject('Virker æ'))
                .then(json => setState({data: json as Character[], error: null, loading: false}))
                .catch(rejection => setState({data: null, error: rejection, loading: false}));
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