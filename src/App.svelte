<script lang="ts">
    import TailwindCss from './TailwindCss.svelte';
    import { initExternal } from './external';
    import { login } from './auth/auth';
    import { resolvedInputs } from './input/inputs';
    import { defaultConfig as config } from './defaults';

    import NavBar from './ui/NavBar.svelte';
    import Login from './ui/Login.svelte';
    import ResolveInputs from './ui/ResolveInputs.svelte';
    import S3Edit from './ui/S3Edit.svelte';
    import ComponentDefinition from './svelte/ComponentDefinition';

    initExternal(document);

    let component: ComponentDefinition;
    $: {
        if (!$login) {
            component = new ComponentDefinition(Login);
        } else {
            if ($resolvedInputs === config.inputs.length) {
                component = new ComponentDefinition(S3Edit);
            } else {
                component = new ComponentDefinition(ResolveInputs, { inputs: config.inputs });
            }
        }
    }
</script>

<TailwindCss />

<div class="overflow-scroll h-screen antialiased bg-gray-100">
    <NavBar />
    <main class="mt-10 h-full">
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
