import type { SvelteComponent } from 'svelte';

export default class ComponentDefinition {
    component: object;
    args: object;

    constructor(component: object, args: object = {}) {
        this.component = component;
        this.args = args;
    }
}
