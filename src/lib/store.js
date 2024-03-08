import { writable } from 'svelte/store';

export const validPolyAvail = writable(false);
export const polyFunction = writable('');
export const global_basketball_page = writable(1); // current page of basketball
export const global_stock_page = writable(1); // current page of football
