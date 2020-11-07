<script lang="ts">
    import TailwindCss from './TailwindCss.svelte';
    import { login } from './auth/auth';
    import ComponentDefinition from './svelte/ComponentDefinition';
    import Login from './ui/Login.svelte';
    import S3Edit from './ui/S3Edit.svelte';
    import PickCloudFormationStack from './ui/PickCloudFormationStack.svelte';
    import NavBar from './ui/NavBar.svelte';

    let component: ComponentDefinition;
    $: {
        if (!$login) {
            component = new ComponentDefinition(Login);
        } else {
            component = new ComponentDefinition(PickCloudFormationStack);
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
