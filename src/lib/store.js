import { writable } from 'svelte/store';

export const validPolyAvail = writable(false);
export const polyFunction = writable('');
export const global_basketball_page = writable(1); // current page of basketball
export const global_stock_page = writable(1); // current page of football
export const global_stock_text = writable("Welcome to the stock graph. Here we are going to go through an example of how understanding the key components of a function can be utilized to understand a company's stock trends. Specifically, we will be looking into the local mins and maxes, along with their relationship to the first derivative of the original function. \n \n For this graph, we generated a function that looks similar to what a company's stock trends could look like over a short period of time. \n\n f(x) = 3x^3 + 1/2 (1 - x) - 2/3 x^5 - sin(x). ");
