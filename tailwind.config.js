const production = !process.env.ROLLUP_WATCH;
module.exports = {
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    purge: [{ content: ['./src/**/*.svelte', './public/**/*.html'], css: ['./public/**/*.css'], enabled: production }],
    theme: {
        extend: {
            height: {
                9: '2.25rem',
            },
            margin: {
                7: '1.75rem',
            },
        },
    },
    variants: {
        borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
    },
    plugins: [],
};
