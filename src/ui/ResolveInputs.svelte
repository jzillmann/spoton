<script lang="ts">
    import { blur } from 'svelte/transition';
    import type { Input } from '../config/config';
    import type ResolvedInput from '../input/ResolvedInput';
    import { inputs as inputStore } from '../input/inputs';
    import { resolveInputComponent } from '../input/inputs';

    export let inputs: Input[];
    let currentInput = 0;
    let resolvedInputs = new Array<ResolvedInput>();
    $: currentInputComponent = resolveInputComponent(inputs[currentInput]);

    function submitInput(resolvedInput: ResolvedInput) {
        resolvedInputs.push(resolvedInput);
        if (currentInput < inputs.length - 1) {
            currentInput++;
        } else {
            inputStore.set(resolvedInputs);
        }
    }
</script>

<div class="fixed p-2 bg-gray-400 shadow rounded-r">
    <div class="mb-1 text-lg font-semibold">Inputs</div>
    {#each inputs as input, idx}
        <div
            class="ml-2 pl-1 border-l-2 border-gray-400"
            class:selected={currentInput == idx}
            class:resolved={currentInput > idx}>
            -
            {input.name}
        </div>
    {/each}
    <div class="mt-2 font-hairline text-sm">Resolved {currentInput}/{inputs.length}</div>
</div>

<div class="container mx-auto flex justify-center items-center">
    <div class="mt-10">
        <div class="text-4xl font-bold font-serif mb-3 text-center" in:blur>
            Pick
            <div>{inputs[currentInput].type}</div>
        </div>
        <svelte:component
            this={currentInputComponent.component}
            submitFunction={submitInput}
            {...currentInputComponent.args} />
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
