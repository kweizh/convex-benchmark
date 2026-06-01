import { readable } from 'svelte/store';
import { client } from './convex';

export function useQuery(query, args) {
    return readable(undefined, (set) => {
        const unsubscribe = client.onUpdate(query, args, (data) => {
            set(data);
        });
        return unsubscribe;
    });
}
