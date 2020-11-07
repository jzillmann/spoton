<script lang="ts">
    import TailwindCss from './TailwindCss.svelte';
    import { login } from './auth/auth';
    import { inputs } from './input/inputs';
    import { defaultConfig } from './defaults';

    import NavBar from './ui/NavBar.svelte';
    import Login from './ui/Login.svelte';
    import ResolveInputs from './ui/ResolveInputs.svelte';
    import S3Edit from './ui/S3Edit.svelte';
    import ComponentDefinition from './svelte/ComponentDefinition';

    let component: ComponentDefinition;
    $: {
        if (!$login) {
            component = new ComponentDefinition(Login);
        } else {
            if (!$inputs) {
                const config = defaultConfig;
                component = new ComponentDefinition(ResolveInputs, { inputs: config.inputs });
            } else {
                component = new ComponentDefinition(S3Edit);
            }
        }
    }
</script>

<TailwindCss />

<div class="overflow-scroll h-screen antialiased bg-gray-100">
    <NavBar />
    <main class="mt-10">
        <svelte:component this={component.component} {...component.args} />
    </main>
</div>

<style>
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
