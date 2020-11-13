import { readable } from 'svelte/store';

export const now = readable(new Date(), function start(set) {
    const interval = setInterval(() => {
        set(new Date());
    }, 1000);

    return function stop() {
        clearInterval(interval);
    };
});

export function displayDate(date: Date): string {
    const thisYear = new Date().getFullYear();
    const year = thisYear === date.getFullYear() ? '' : '/' + date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${day}/${month}${year} ${date.getHours()}:${date.getMinutes()}`;
}
