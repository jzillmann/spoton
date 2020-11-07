<script lang="ts">
    import { blur } from 'svelte/transition';
    import Spinner from './Spinner.svelte';

    export let promise: Promise<any>;
    export let message: string;
</script>

<div class="mt-10 container mx-auto flex justify-center items-center">
    {#await promise}
        <div class="text-2xl" in:blur>{message}</div>
        <span in:blur={{ delay: 200 }}>
            <Spinner class="h-6 w-6 mt-1" />
        </span>
    {:catch error}
        <div class="text-red-800">ERROR: {error}</div>
    {/await}
</div>
