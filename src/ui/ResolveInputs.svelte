<script lang="ts">
    import { blur } from 'svelte/transition';
    import type { Input } from '../config/config';
    import { resolvedInputs } from '../input/inputs';
    import { resolveInputComponent } from '../input/inputs';

    export let inputs: Input[];
    $: currentInputComponent = resolveInputComponent(inputs[$resolvedInputs]);
</script>

<div class="fixed p-2 bg-gray-400 shadow rounded-r">
    <div class="mb-1 text-lg font-semibold">Inputs</div>
    {#each inputs as input, idx}
        <div
            class="ml-2 pl-1 border-l-2 border-gray-400"
            class:selected={$resolvedInputs == idx}
            class:resolved={$resolvedInputs > idx}>
            -
            {input.name}
        </div>
    {/each}
    <div class="mt-2 font-hairline text-sm">Resolved {$resolvedInputs}/{inputs.length}</div>
</div>

<div class="container mx-auto flex justify-center items-center">
    <div class="mt-10">
        <div class="text-4xl font-bold font-serif mb-3 text-center" in:blur>
            Pick
            <div>{inputs[$resolvedInputs].type}</div>
        </div>
        <svelte:component this={currentInputComponent.component} {...currentInputComponent.args} />
    </div>
</div>

<style>
    .selected {
        @apply border-teal-500;
    }
    .resolved {
        @apply border-indigo-400;
    }
</style>
