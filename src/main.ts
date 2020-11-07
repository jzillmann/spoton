import App from './App.svelte';

declare var providedEvents: object[];

const app = new App({
    target: document.body,
    props: {},
});

export default app;
