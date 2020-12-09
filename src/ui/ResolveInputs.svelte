<script lang="ts">
    import { blur } from 'svelte/transition';
    import slideX from '../svelte/slideX';
    import type { Input } from '../config/config';
    import { resolvedInputs } from '../input/inputs';
    import { resolveInputComponent } from '../input/inputs';
    import type ComponentDefinition from '../svelte/ComponentDefinition';

    export let inputs: Input[];

    let currentInput: Input;
    let currentInputComponent: ComponentDefinition;
    $: {
        if ($resolvedInputs < inputs.length) {
            currentInput = inputs[$resolvedInputs];
            currentInputComponent = resolveInputComponent(currentInput);
        }
    }
</script>

<!-- status widget-->
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

<!-- Header and input component -->
<div class="mt-20 container mx-auto flex flex-col justify-center items-center">
    <!-- Header -->
    <div class="mb-3 max-w-full w-2/3" in:blur>
        <div class="grid grid-cols-2 text-4xl font-bold font-serif">
            <div class="col-start-1 justify-self-end mr-2">Resolve Input</div>
                <div class="col-start-2 row-start-1 justify-self-start flex space-x-1 items-baseline">
                    {#key currentInput.name}
                        <div class="flex space-x-1 items-baseline" transition:slideX>
                            <div class="selected border-b-2">'{currentInput.name}'</div>
                            <div class="opacity-50 text-base">({currentInput.type})</div>
                        </div>
                    {/key}
                </div>
            </div>
    </div>

    <!-- Input Component -->
    <svelte:component this={currentInputComponent.component} {...currentInputComponent.args} />
</div>

<style>
    .selected {
        @apply border-teal-500;
    }
    .resolved {
        @apply border-indigo-400;
    }
</style>
