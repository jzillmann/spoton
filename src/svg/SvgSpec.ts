export default interface SvgSpec {
    d: string;
    size: string;
    animation?: string;
}

/**
 * Templates for svg, used together with SvgIcon or Button.
 * 'activeAnim' just takes any css class (like the tailwind animate-xxx classes) and is applied by Button when pressed.
 * Additional anims should be defined on Tailwind level, see https://tailwindcss.com/docs/animation.
 */

export const refreshSpec: SvgSpec = {
    d: 'M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15',
    size: 'w-6',
    animation: 'animate-spin-reverse',
};

export const saveSpec: SvgSpec = {
    d: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4',
    size: 'w-6',
    animation: 'animate-bounce2',
};

export const clipboardSpec: SvgSpec = {
    d:
        'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    size: 'w-6',
};
