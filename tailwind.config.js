const production = !process.env.ROLLUP_WATCH;
module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: [{ content: ['./src/**/*.svelte', './public/**/*.html'], css: ['./public/**/*.css'], enabled: production }],
    theme: {
        extend: {
            width: {
                9: '2.25rem',
            },
            height: {
                9: '2.25rem',
            },
            margin: {
                7: '1.75rem',
            },
            borderWidth: {
                3: '3px',
            },
            keyframes: {
                'spin-reverse': {
                    '0%': { transform: 'rotate(359deg)' },
                    '100%': { transform: 'rotate(0deg)' },
                },
                bounce2: {
                    '0%': { transform: 'translateY(0)' },
                    '25%': { transform: 'translateY(-15%)' },
                    '100%': { transform: 'translateY(10%)' },
                },
            },
            animation: {
                'spin-reverse': 'spin-reverse 1s linear infinite',
                bounce2: 'bounce2 1s cubic-bezier(0.5, 0.81, 0.64, 0.22) infinite',
            },
        },
    },
    variants: {
        borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
    },
    plugins: [],
};
