import {useEffect, useState} from 'react';
import {getAllData} from '../api/client';

export function useCinemaData() {
    const [data, setData] = useState({halls: [], films: [], seances: []});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await getAllData();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return {data, loading, error};
}